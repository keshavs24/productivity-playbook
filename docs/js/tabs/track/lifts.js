/**
 * track/lifts.js — Lifts sub-tab
 * Stub: will be refactored from the original lifts.js
 */

export async function renderLiftsSubTab(container) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const title = document.createElement('div');
  title.className = 'empty-state__title';
  title.textContent = 'Lifts';
  const desc = document.createElement('div');
  desc.className = 'empty-state__desc';
  desc.textContent = 'Log your workouts and track PRs. Coming soon in v2.';
  empty.appendChild(title);
  empty.appendChild(desc);
  container.appendChild(empty);
}
