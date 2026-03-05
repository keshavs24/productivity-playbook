/**
 * app.js — Entry point: auth, tab navigation, init
 */

import { OAUTH_CLIENT_ID, SHEET_ID } from '../config.js';
import { initAuth, setClientId, signIn, isAuthenticated, silentRefresh } from './api.js';
import { initStore, flushPendingWrites, isOnline } from './store.js';
import { renderDashboard } from './tabs/dashboard.js';
import { renderCheckin } from './tabs/checkin.js';
import { renderNutrition } from './tabs/nutrition.js';
import { renderLifts } from './tabs/lifts.js';
import { renderPrayers } from './tabs/prayers.js';
import { writeRange } from './api.js';

let currentTab = 'tab-dashboard';
const tabRenderers = {
  'tab-dashboard': renderDashboard,
  'tab-checkin': renderCheckin,
  'tab-nutrition': renderNutrition,
  'tab-lifts': renderLifts,
  'tab-prayers': renderPrayers
};
const loadedTabs = new Set();

/**
 * Wait for Google Identity Services library to load
 */
function waitForGIS(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.accounts) {
      return resolve();
    }
    const start = Date.now();
    const check = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(check);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(check);
        reject(new Error('Google Identity Services failed to load'));
      }
    }, 100);
  });
}

/**
 * Initialize the app
 */
async function init() {
  // Init IndexedDB
  await initStore();

  // Check config
  if (!OAUTH_CLIENT_ID || !SHEET_ID) {
    document.getElementById('login-screen').querySelector('p').textContent =
      'Please set OAUTH_CLIENT_ID and SHEET_ID in config.js';
    return;
  }

  // Set up tab navigation (do this before GIS so nav works regardless)
  setupNavigation();

  // Online/offline handlers
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Register service worker
  registerSW();

  // Wait for GIS to load (poll since async script may not be ready)
  try {
    await waitForGIS();
    initGIS();
  } catch (e) {
    console.error(e);
    const subtitle = document.querySelector('.login-subtitle');
    if (subtitle) subtitle.textContent = 'Failed to load Google sign-in. Try refreshing.';
  }
}

/**
 * Initialize Google Identity Services
 */
function initGIS() {
  setClientId(OAUTH_CLIENT_ID);
  initAuth(onAuthenticated);

  // Login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in...';
      signIn();
    });
  }
}

/**
 * Called after successful authentication
 */
async function onAuthenticated() {
  // Hide login, show app
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app').hidden = false;
  document.getElementById('loading').hidden = false;

  // Flush any pending offline writes
  if (isOnline()) {
    try {
      await flushPendingWrites(writeRange);
    } catch (e) {
      console.error('Failed to flush pending writes:', e);
    }
  }

  // Load initial tab (dashboard)
  await switchTab('tab-dashboard');
  document.getElementById('loading').hidden = true;
}

/**
 * Set up bottom nav tab switching
 */
function setupNavigation() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    const tabId = btn.dataset.tab;
    switchTab(tabId);
  });
}

/**
 * Switch to a tab
 */
async function switchTab(tabId) {
  // Update active tab button
  document.querySelectorAll('#bottom-nav [data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Show/hide panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.hidden = panel.id !== tabId;
  });

  currentTab = tabId;

  // Lazy-load tab content
  const renderer = tabRenderers[tabId];
  if (renderer) {
    try {
      await renderer(!loadedTabs.has(tabId));
      loadedTabs.add(tabId);
    } catch (e) {
      console.error(`Error rendering ${tabId}:`, e);
      const panel = document.getElementById(tabId);
      if (panel && !panel.querySelector('.error-msg')) {
        panel.innerHTML = `<div class="card error-msg" style="text-align:center;padding:2rem;">
          <p style="color:var(--error)">Failed to load. Pull down to retry.</p>
          <p style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.5rem;">${e.message}</p>
        </div>`;
      }
    }
  }
}

/**
 * Handle coming back online
 */
async function onOnline() {
  showToast('Back online — syncing...');
  try {
    await flushPendingWrites(writeRange);
    // Refresh current tab
    loadedTabs.clear();
    await switchTab(currentTab);
    showToast('Synced!');
  } catch (e) {
    console.error('Sync failed:', e);
  }
}

/**
 * Handle going offline
 */
function onOffline() {
  showToast('Offline — changes will sync when connected');
}

/**
 * Show a toast notification
 */
export function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Show achievement popup
 */
export function showAchievement(name, description, xp) {
  const overlay = document.getElementById('achievement-overlay');
  if (!overlay) return;

  overlay.querySelector('.achievement-name').textContent = name;
  overlay.querySelector('.achievement-description').textContent = description;
  overlay.querySelector('.achievement-xp').textContent = `+${xp} XP`;
  overlay.hidden = false;

  const dismissBtn = overlay.querySelector('.achievement-dismiss');
  const dismiss = () => {
    overlay.hidden = true;
    dismissBtn.removeEventListener('click', dismiss);
  };
  dismissBtn.addEventListener('click', dismiss);
}

/**
 * Register service worker
 */
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (e) {
      console.error('SW registration failed:', e);
    }
  }
}

/**
 * Refresh current tab data
 */
export async function refreshCurrentTab() {
  loadedTabs.delete(currentTab);
  await switchTab(currentTab);
}

// Start the app
init();
