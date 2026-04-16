/**
 * track/body.js — Body composition sub-tab
 * Stub: new sub-tab for AM/PM weight, body fat tracking
 */

export async function renderBodySubTab(container) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const title = document.createElement('div');
  title.className = 'empty-state__title';
  title.textContent = 'Body';
  const desc = document.createElement('div');
  desc.className = 'empty-state__desc';
  desc.textContent = 'Track body composition and weight trends. Coming soon in v2.';
  empty.appendChild(title);
  empty.appendChild(desc);
  container.appendChild(empty);
}
