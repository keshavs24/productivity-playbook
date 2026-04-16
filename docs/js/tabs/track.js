/**
 * track.js — Consolidated tracking tab with pill-tab sub-navigation
 * Sub-tabs: Nutrition, Lifts, Prayers, Body
 */

import { createPillTabs } from '../components/pill-tabs.js';

const SUB_TABS = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'lifts',     label: 'Lifts' },
  { id: 'prayers',   label: 'Prayers' },
  { id: 'body',      label: 'Body' },
];

let currentSubTab = 'nutrition';
let pillNav = null;
const subTabContainer = {};

export async function renderTrack(isFirstLoad) {
  const panel = document.getElementById('tab-track');
  if (!panel) return;

  if (isFirstLoad) {
    panel.textContent = '';

    // Create pill tab navigation
    pillNav = createPillTabs(SUB_TABS, currentSubTab, async (tabId) => {
      currentSubTab = tabId;
      await renderSubTab(panel);
    });
    panel.appendChild(pillNav);

    // Create sub-tab content container
    const content = document.createElement('div');
    content.id = 'track-content';
    panel.appendChild(content);
  }

  await renderSubTab(panel);
}

async function renderSubTab(panel) {
  const content = document.getElementById('track-content');
  if (!content) return;

  content.textContent = '';

  try {
    switch (currentSubTab) {
      case 'nutrition': {
        const { renderNutritionSubTab } = await import('./track/nutrition.js');
        await renderNutritionSubTab(content);
        break;
      }
      case 'lifts': {
        const { renderLiftsSubTab } = await import('./track/lifts.js');
        await renderLiftsSubTab(content);
        break;
      }
      case 'prayers': {
        const { renderPrayersSubTab } = await import('./track/prayers.js');
        await renderPrayersSubTab(content);
        break;
      }
      case 'body': {
        const { renderBodySubTab } = await import('./track/body.js');
        await renderBodySubTab(content);
        break;
      }
    }
  } catch (e) {
    console.error(`Error rendering ${currentSubTab}:`, e);
    const errMsg = document.createElement('div');
    errMsg.className = 'empty-state';
    const title = document.createElement('div');
    title.className = 'empty-state__title';
    title.textContent = `Failed to load ${currentSubTab}`;
    const desc = document.createElement('div');
    desc.className = 'empty-state__desc';
    desc.textContent = e.message;
    errMsg.appendChild(title);
    errMsg.appendChild(desc);
    content.appendChild(errMsg);
  }
}
