/**
 * track/prayers.js — Prayers sub-tab
 * Stub: will be refactored from the original prayers.js
 */

export async function renderPrayersSubTab(container) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const title = document.createElement('div');
  title.className = 'empty-state__title';
  title.textContent = 'Prayers';
  const desc = document.createElement('div');
  desc.className = 'empty-state__desc';
  desc.textContent = 'Track fard and sunnah prayers. Coming soon in v2.';
  empty.appendChild(title);
  empty.appendChild(desc);
  container.appendChild(empty);
}
