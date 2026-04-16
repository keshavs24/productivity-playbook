/**
 * pill-tabs.js — Horizontal scrollable pill tab navigation
 * Used as sub-navigation within the Track tab.
 *
 * Usage:
 *   createPillTabs(tabs, activeId, onSelect)
 *   tabs: [{ id, label }]
 *   Returns an HTMLElement.
 */

export function createPillTabs(tabs, activeId, onSelect) {
  const nav = document.createElement('nav');
  nav.className = 'pill-tabs';
  nav.setAttribute('role', 'tablist');

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-tab';
    if (tab.id === activeId) btn.classList.add('pill-tab--active');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.id === activeId ? 'true' : 'false');
    btn.setAttribute('aria-controls', `subtab-${tab.id}`);
    btn.dataset.tabId = tab.id;
    btn.textContent = tab.label;

    btn.addEventListener('click', () => {
      // Deactivate all
      nav.querySelectorAll('.pill-tab').forEach(t => {
        t.classList.remove('pill-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      // Activate clicked
      btn.classList.add('pill-tab--active');
      btn.setAttribute('aria-selected', 'true');

      if (onSelect) onSelect(tab.id);
    });

    nav.appendChild(btn);
  });

  return nav;
}

/**
 * Programmatically set the active pill tab.
 */
export function setActivePillTab(nav, tabId) {
  nav.querySelectorAll('.pill-tab').forEach(btn => {
    const active = btn.dataset.tabId === tabId;
    btn.classList.toggle('pill-tab--active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}
