/**
 * profile.js — Profile tab (Firebase backend)
 * Character stats, level/XP, achievement gallery.
 */

import { getRecentLogs, getAchievements } from '../firebase.js';
import { getLevelFromXP, getLevelTitle } from '../engine.js';
import { createProgressBar } from '../components/progress-bar.js';
import { ATTRIBUTES } from '../../config.js';

export async function renderProfile(isFirstLoad) {
  const panel = document.getElementById('tab-profile');
  if (!panel) return;

  const [recentLogs, achievements] = await Promise.all([
    getRecentLogs(7),
    getAchievements()
  ]);

  renderProfileContent(panel, recentLogs, achievements);
}

function renderProfileContent(panel, recentLogs, achievements) {
  const latestLog = recentLogs[recentLogs.length - 1] || {};
  const totalXP = latestLog.totalXp || 0;
  const level = getLevelFromXP(totalXP);
  const title = getLevelTitle(level);

  panel.textContent = '';

  // Character card
  const charCard = document.createElement('div');
  charCard.className = 'card';
  charCard.style.textAlign = 'center';

  const levelNum = document.createElement('div');
  levelNum.style.cssText = 'font-family: "Space Grotesk"; font-size: 3rem; font-weight: 700;';
  levelNum.textContent = level;
  charCard.appendChild(levelNum);

  const titleEl = document.createElement('div');
  titleEl.style.cssText = 'color: var(--accent); font-weight: 500; margin-bottom: var(--sp-2);';
  titleEl.textContent = title;
  charCard.appendChild(titleEl);

  const xpEl = document.createElement('div');
  xpEl.className = 'data-value text-muted';
  xpEl.style.fontSize = '0.875rem';
  xpEl.textContent = `${totalXP.toLocaleString()} XP`;
  charCard.appendChild(xpEl);

  panel.appendChild(charCard);

  // Character attributes (7-day averages)
  const attrLabel = document.createElement('h3');
  attrLabel.className = 'section-label';
  attrLabel.textContent = 'Character Stats (7-day avg)';
  panel.appendChild(attrLabel);

  const attrCard = document.createElement('div');
  attrCard.className = 'card stack stack--3';

  ATTRIBUTES.forEach((attr, i) => {
    const values = recentLogs
      .map(log => (log.attributes || [])[i] || 0)
      .filter(v => v > 0);
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    const row = document.createElement('div');
    row.className = 'row row--between';

    const label = document.createElement('span');
    label.style.cssText = 'font-size: 0.8125rem; color: var(--text-secondary); width: 120px;';
    label.textContent = attr;
    row.appendChild(label);

    const barWrapper = document.createElement('div');
    barWrapper.style.flex = '1';
    barWrapper.insertAdjacentHTML('beforeend', createProgressBar(avg * 20, { thick: true }));
    row.appendChild(barWrapper);

    const val = document.createElement('span');
    val.className = 'data-value';
    val.style.cssText = 'font-size: 0.75rem; width: 32px; text-align: right;';
    val.textContent = avg > 0 ? avg.toFixed(1) : '—';
    row.appendChild(val);

    attrCard.appendChild(row);
  });

  panel.appendChild(attrCard);

  // Achievements
  const achLabel = document.createElement('h3');
  achLabel.className = 'section-label';
  achLabel.textContent = 'Achievements';
  panel.appendChild(achLabel);

  const achEntries = Object.entries(achievements).filter(([_, v]) => v.unlocked);

  if (achEntries.length > 0) {
    const achCard = document.createElement('div');
    achCard.className = 'card stack stack--2';

    // Sort by unlock date, most recent first
    achEntries
      .sort((a, b) => (b[1].unlockedAt?.seconds || 0) - (a[1].unlockedAt?.seconds || 0))
      .slice(0, 10)
      .forEach(([id, ach]) => {
        const badge = document.createElement('div');
        badge.className = 'badge';

        const icon = document.createElement('div');
        icon.className = `badge__icon badge__icon--${ach.category || 'mastery'}`;
        icon.textContent = '★';
        badge.appendChild(icon);

        const info = document.createElement('div');
        info.className = 'badge__info';
        const name = document.createElement('div');
        name.className = 'badge__name';
        name.textContent = ach.title || id;
        info.appendChild(name);
        const desc = document.createElement('div');
        desc.className = 'badge__desc';
        desc.textContent = ach.description || '';
        info.appendChild(desc);
        badge.appendChild(info);

        achCard.appendChild(badge);
      });

    panel.appendChild(achCard);
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const emptyTitle = document.createElement('div');
    emptyTitle.className = 'empty-state__title';
    emptyTitle.textContent = 'No achievements yet';
    empty.appendChild(emptyTitle);
    const emptyDesc = document.createElement('div');
    emptyDesc.className = 'empty-state__desc';
    emptyDesc.textContent = 'Keep showing up. Your first badge is around the corner.';
    empty.appendChild(emptyDesc);
    panel.appendChild(empty);
  }

  // Bottom spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  panel.appendChild(spacer);
}
