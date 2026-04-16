/**
 * track/prayers.js — Prayer tracker sub-tab
 * Tracks 11 daily prayers (5 fard + 5 sunnah + 1 witr)
 * with timeline view, completion ring, and weekly heatmap.
 */

import { getTodayPrayers, updatePrayer, getRecentPrayers } from '../../firebase.js';
import { createProgressBar } from '../../components/progress-bar.js';
import { PRAYERS } from '../../../config.js';

// Prayer field keys matching firebase.js document shape
const PRAYER_KEYS = [
  'fajrSunnah', 'fajrFard',
  'dhuhrSunnahBefore', 'dhuhrFard', 'dhuhrSunnahAfter',
  'asrFard',
  'maghribFard', 'maghribSunnah',
  'ishaFard', 'ishaSunnah',
  'witr'
];

// Group prayers by time for timeline display
const PRAYER_GROUPS = [
  { time: 'Fajr',    prayers: [{ key: 'fajrSunnah', label: 'Sunnah', type: 'sunnah', rakahs: 2 },
                                { key: 'fajrFard', label: 'Fard', type: 'fard', rakahs: 2 }] },
  { time: 'Dhuhr',   prayers: [{ key: 'dhuhrSunnahBefore', label: 'Sunnah (Before)', type: 'sunnah', rakahs: 4 },
                                { key: 'dhuhrFard', label: 'Fard', type: 'fard', rakahs: 4 },
                                { key: 'dhuhrSunnahAfter', label: 'Sunnah (After)', type: 'sunnah', rakahs: 2 }] },
  { time: 'Asr',     prayers: [{ key: 'asrFard', label: 'Fard', type: 'fard', rakahs: 4 }] },
  { time: 'Maghrib', prayers: [{ key: 'maghribFard', label: 'Fard', type: 'fard', rakahs: 3 },
                                { key: 'maghribSunnah', label: 'Sunnah', type: 'sunnah', rakahs: 2 }] },
  { time: 'Isha',    prayers: [{ key: 'ishaFard', label: 'Fard', type: 'fard', rakahs: 4 },
                                { key: 'ishaSunnah', label: 'Sunnah', type: 'sunnah', rakahs: 2 },
                                { key: 'witr', label: 'Witr', type: 'wajib', rakahs: 3 }] },
];

export async function renderPrayersSubTab(container) {
  const [todayPrayers, recentPrayers] = await Promise.all([
    getTodayPrayers(),
    getRecentPrayers(7)
  ]);

  container.textContent = '';

  // Completion summary
  const fardCount = ['fajrFard', 'dhuhrFard', 'asrFard', 'maghribFard', 'ishaFard']
    .filter(k => !!todayPrayers[k]).length;
  const totalCount = PRAYER_KEYS.filter(k => !!todayPrayers[k]).length;

  const summaryCard = document.createElement('div');
  summaryCard.className = 'card';
  summaryCard.style.textAlign = 'center';

  const totalEl = document.createElement('div');
  totalEl.className = 'data-value';
  totalEl.style.fontSize = '2rem';
  totalEl.textContent = `${totalCount} / ${PRAYER_KEYS.length}`;
  summaryCard.appendChild(totalEl);

  const summaryRow = document.createElement('div');
  summaryRow.style.cssText = 'display: flex; justify-content: center; gap: var(--sp-6); margin-top: var(--sp-2);';

  const fardLabel = document.createElement('span');
  fardLabel.style.cssText = 'font-size: 0.8125rem; color: var(--accent);';
  fardLabel.textContent = `${fardCount}/5 Fard`;
  summaryRow.appendChild(fardLabel);

  const sunnahLabel = document.createElement('span');
  sunnahLabel.style.cssText = 'font-size: 0.8125rem; color: var(--text-tertiary);';
  sunnahLabel.textContent = `${totalCount - fardCount}/6 Sunnah`;
  summaryRow.appendChild(sunnahLabel);

  summaryCard.appendChild(summaryRow);
  summaryCard.insertAdjacentHTML('beforeend',
    '<div style="margin-top: var(--sp-3);">' + createProgressBar((totalCount / PRAYER_KEYS.length) * 100) + '</div>');
  container.appendChild(summaryCard);

  // Prayer timeline
  const timelineLabel = document.createElement('h3');
  timelineLabel.className = 'section-label';
  timelineLabel.textContent = 'Today\'s Prayers';
  container.appendChild(timelineLabel);

  const timeline = document.createElement('div');
  timeline.className = 'prayer-timeline';

  PRAYER_GROUPS.forEach(group => {
    // Time header
    const timeHeader = document.createElement('div');
    timeHeader.style.cssText = 'font-weight: 600; font-size: 0.875rem; padding: var(--sp-3) 0 var(--sp-1); color: var(--text-primary);';
    timeHeader.textContent = group.time;
    timeline.appendChild(timeHeader);

    // Prayer buttons
    group.prayers.forEach(prayer => {
      const isCompleted = !!todayPrayers[prayer.key];

      const block = document.createElement('div');
      block.className = `prayer-block prayer-block--${prayer.type}`;
      if (isCompleted) block.classList.add('prayer-block--completed');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'display: flex; align-items: center; justify-content: space-between; width: 100%; padding: var(--sp-2) 0; background: none; cursor: pointer; min-height: 44px;';
      btn.setAttribute('aria-pressed', isCompleted ? 'true' : 'false');

      const nameEl = document.createElement('span');
      nameEl.className = 'prayer-block__name';
      nameEl.textContent = prayer.label;
      btn.appendChild(nameEl);

      const metaEl = document.createElement('span');
      metaEl.className = 'prayer-block__time';
      metaEl.textContent = `${prayer.rakahs} rak'ah`;
      btn.appendChild(metaEl);

      btn.addEventListener('click', async () => {
        const newState = !block.classList.contains('prayer-block--completed');
        block.classList.toggle('prayer-block--completed', newState);
        btn.setAttribute('aria-pressed', newState ? 'true' : 'false');
        await updatePrayer(prayer.key, newState);

        // Update summary counts
        const newFard = ['fajrFard', 'dhuhrFard', 'asrFard', 'maghribFard', 'ishaFard']
          .filter(k => {
            if (k === prayer.key) return newState;
            return !!todayPrayers[k];
          }).length;
        todayPrayers[prayer.key] = newState;
        const newTotal = PRAYER_KEYS.filter(k => !!todayPrayers[k]).length;
        totalEl.textContent = `${newTotal} / ${PRAYER_KEYS.length}`;
        fardLabel.textContent = `${newFard}/5 Fard`;
        sunnahLabel.textContent = `${newTotal - newFard}/6 Sunnah`;
      });

      block.appendChild(btn);
      timeline.appendChild(block);
    });
  });

  container.appendChild(timeline);

  // Weekly heatmap
  if (recentPrayers.length > 1) {
    const heatLabel = document.createElement('h3');
    heatLabel.className = 'section-label';
    heatLabel.textContent = 'This Week';
    container.appendChild(heatLabel);

    const heatCard = document.createElement('div');
    heatCard.className = 'card';
    heatCard.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; font-size: 0.75rem; border-collapse: collapse;';

    // Header row with dates
    const thead = document.createElement('tr');
    const emptyTh = document.createElement('th');
    emptyTh.style.cssText = 'text-align: left; padding: var(--sp-1) var(--sp-2); color: var(--text-tertiary); width: 80px;';
    thead.appendChild(emptyTh);

    const sortedDays = recentPrayers.slice(-7).sort((a, b) => a.date.localeCompare(b.date));
    sortedDays.forEach(day => {
      const th = document.createElement('th');
      th.style.cssText = 'text-align: center; padding: var(--sp-1); color: var(--text-tertiary); font-weight: 500;';
      const d = new Date(day.date);
      th.textContent = ['S','M','T','W','T','F','S'][d.getDay()];
      thead.appendChild(th);
    });
    table.appendChild(thead);

    // Row per prayer
    PRAYER_KEYS.forEach((key, i) => {
      const row = document.createElement('tr');
      const labelCell = document.createElement('td');
      labelCell.style.cssText = 'padding: var(--sp-1) var(--sp-2); color: var(--text-secondary); white-space: nowrap;';
      const prayer = PRAYERS[i];
      labelCell.textContent = prayer ? prayer.name.replace(/^(Fajr|Dhuhr|Asr|Maghrib|Isha)\s*/, '').replace('Sunnah Before', 'S.B').replace('Sunnah After', 'S.A') || prayer.name : key;
      row.appendChild(labelCell);

      sortedDays.forEach(day => {
        const cell = document.createElement('td');
        cell.style.cssText = 'text-align: center; padding: var(--sp-1);';
        const dot = document.createElement('div');
        dot.style.cssText = `width: 10px; height: 10px; border-radius: 50%; margin: 0 auto; ${
          day[key]
            ? (key.includes('Fard') || key === 'asrFard' || key === 'maghribFard'
                ? 'background: var(--accent);'
                : 'background: var(--success);')
            : 'background: var(--bg-elevated);'
        }`;
        cell.appendChild(dot);
        row.appendChild(cell);
      });
      table.appendChild(row);
    });

    heatCard.appendChild(table);
    container.appendChild(heatCard);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}
