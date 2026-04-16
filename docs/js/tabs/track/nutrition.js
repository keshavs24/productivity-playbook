/**
 * track/nutrition.js — Nutrition sub-tab
 * Stub: will be refactored from the original nutrition.js
 */

export async function renderNutritionSubTab(container) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const title = document.createElement('div');
  title.className = 'empty-state__title';
  title.textContent = 'Nutrition';
  const desc = document.createElement('div');
  desc.className = 'empty-state__desc';
  desc.textContent = 'Track your macros and calories. Coming soon in v2.';
  empty.appendChild(title);
  empty.appendChild(desc);
  container.appendChild(empty);
}
