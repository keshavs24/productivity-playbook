/**
 * app.js — Entry point: Firebase auth, tab navigation, init
 * v2: Firebase backend, 4-tab layout (Today, Track, Learn, Profile)
 */

import { FIREBASE_CONFIG, AUTH_EMAIL, AUTH_PASSWORD } from '../config.js';
import { initFirebase, waitForAuth, signInWithEmail, signInAnon, getCurrentUser } from './firebase.js';
import { renderToday } from './tabs/today.js';
import { renderTrack } from './tabs/track.js';
import { renderLearn } from './tabs/learn.js';
import { renderProfile } from './tabs/profile.js';

let currentTab = 'tab-today';
const tabRenderers = {
  'tab-today':   renderToday,
  'tab-track':   renderTrack,
  'tab-learn':   renderLearn,
  'tab-profile': renderProfile
};
const loadedTabs = new Set();

/**
 * Initialize the app
 */
async function init() {
  // Validate config
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    document.querySelector('.login-subtitle').textContent =
      'Please set FIREBASE_CONFIG in config.js';
    return;
  }

  // Initialize Firebase (enables offline persistence automatically)
  initFirebase(FIREBASE_CONFIG);

  // Set up tab navigation
  setupNavigation();

  // Register service worker
  registerSW();

  // Check if already authenticated (e.g., returning user with cached session)
  const user = await waitForAuth();
  if (user) {
    onAuthenticated();
  } else {
    // Set up login button
    setupLogin();
  }
}

/**
 * Set up login screen
 */
function setupLogin() {
  const loginBtn = document.getElementById('login-btn');
  if (!loginBtn) return;

  // If email/password are configured, use those
  // Otherwise, show the sign-in button for anonymous auth
  if (AUTH_EMAIL && AUTH_PASSWORD) {
    loginBtn.addEventListener('click', async () => {
      loginBtn.disabled = true;
      loginBtn.querySelector('span').textContent = 'Signing in...';
      try {
        await signInWithEmail(AUTH_EMAIL, AUTH_PASSWORD);
        onAuthenticated();
      } catch (e) {
        console.error('Sign-in failed:', e);
        loginBtn.querySelector('span').textContent = 'Sign-in failed. Try again.';
        loginBtn.disabled = false;
      }
    });
  } else {
    // Anonymous auth (simplest for single-user)
    loginBtn.querySelector('span').textContent = 'Get Started';
    loginBtn.addEventListener('click', async () => {
      loginBtn.disabled = true;
      loginBtn.querySelector('span').textContent = 'Loading...';
      try {
        await signInAnon();
        onAuthenticated();
      } catch (e) {
        console.error('Auth failed:', e);
        loginBtn.querySelector('span').textContent = 'Failed. Try again.';
        loginBtn.disabled = false;
      }
    });
  }
}

/**
 * Called after successful authentication
 */
async function onAuthenticated() {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app').hidden = false;
  document.getElementById('loading').hidden = false;

  // Load initial tab
  await switchTab('tab-today');
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
    switchTab(btn.dataset.tab);
  });
}

/**
 * Switch to a tab
 */
async function switchTab(tabId) {
  document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
    const active = btn.dataset.tab === tabId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-current', active ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });

  currentTab = tabId;

  const renderer = tabRenderers[tabId];
  if (renderer) {
    try {
      await renderer(!loadedTabs.has(tabId));
      loadedTabs.add(tabId);
    } catch (e) {
      console.error(`Error rendering ${tabId}:`, e);
      const panel = document.getElementById(tabId);
      if (panel && !panel.querySelector('.empty-state')) {
        const errDiv = document.createElement('div');
        errDiv.className = 'empty-state';
        const title = document.createElement('div');
        title.className = 'empty-state__title';
        title.textContent = 'Failed to load';
        const desc = document.createElement('div');
        desc.className = 'empty-state__desc';
        desc.textContent = e.message;
        errDiv.appendChild(title);
        errDiv.appendChild(desc);
        panel.textContent = '';
        panel.appendChild(errDiv);
      }
    }
  }
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

  setTimeout(() => {
    toast.classList.add('toast--leaving');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

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

init();
