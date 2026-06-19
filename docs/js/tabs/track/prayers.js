/**
 * track/prayers.js — Prayer tracker sub-tab
 * Tracks 11 daily prayers with timeline, progress ring, and weekly heatmap.
 */

import { getTodayPrayers, updatePrayer, getRecentPrayers } from '../../firebase.js';
import { createProgressRing } from '../../components/progress-ring.js';

const PRAYER_DEFS = [
  { key: 'fajrSunnah', name: 'Fajr Sunnah', time: 'Fajr', type: 'sunnah', rakahs: 2 },
  { key: 'fajrFard', name: 'Fajr Fard', time: 'Fajr', type: 'fard', rakahs: 2 },
  { key: 'dhuhrSunnahBefore', name: 'Dhuhr Sunnah Before', time: 'Dhuhr', type: 'sunnah', rakahs: 4 },
  { key: 'dhuhrFard', name: 'Dhuhr Fard', time: 'Dhuhr', type: 'fard', rakahs: 4 },
  { key: 'dhuhrSunnahAfter', name: 'Dhuhr Sunnah After', time: 'Dhuhr', type: 'sunnah', rakahs: 2 },
  { key: 'asrFard', name: 'Asr Fard', time: 'Asr', type: 'fard', rakahs: 4 },
  { key: 'maghribFard', name: 'Maghrib Fard', time: 'Maghrib', type: 'fard', rakahs: 3 },
  { key: 'maghribSunnah', name: 'Maghrib Sunnah', time: 'Maghrib', type: 'sunnah', rakahs: 2 },
  { key: 'ishaFard', name: 'Isha Fard', time: 'Isha', type: 'fard', rakahs: 4 },
  { key: 'ishaSunnah', name: 'Isha Sunnah', time: 'Isha', type: 'sunnah', rakahs: 2 },
  { key: 'witr', name: 'Witr', time: 'Isha', type: 'wajib', rakahs: 3 },
];

const FARD_KEYS = PRAYER_DEFS.filter(p => p.type === 'fard').map(p => p.key);
const ALL_KEYS = PRAYER_DEFS.map(p => p.key);
const PRAYER_TIMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export async function renderPrayersSubTab(container) {
  container.textContent = '';

  const [todayData, weekData] = await Promise.all([
    getTodayPrayers(),
    getRecentPrayers(7)
  ]);

  // ----- Card 1: Header -----
  const headerCard = document.createElement('div');
  headerCard.className = 'card';
  headerCard.style.textAlign = 'center';
  const headerTitle = document.createElement('h2');
  headerTitle.textContent = 'Prayers';
  headerCard.appendChild(headerTitle);
  const headerDate = document.createElement('div');
  headerDate.className = 'text-muted';
  headerDate.style.marginTop = 'var(--sp-1)';
  headerDate.textContent = formatDate(new Date());
  headerCard.appendChild(headerDate);
  container.appendChild(headerCard);

  // ----- Card 2: Progress Ring + Stats -----
  let fardDone = FARD_KEYS.filter(k => !!todayData[k]).length;
  let totalDone = ALL_KEYS.filter(k => !!todayData[k]).length;
  let completion = totalDone / ALL_KEYS.length;

  const ringCard = document.createElement('div');
  ringCard.className = 'card';
  ringCard.style.textAlign = 'center';

  const ringWrap = document.createElement('div');
  ringWrap.style.display = 'inline-block';
  ringWrap.insertAdjacentHTML('beforeend',
    createProgressRing(completion, String(totalDone), `/ ${ALL_KEYS.length}`, 120));
  ringCard.appendChild(ringWrap);

  const statsRow = document.createElement('div');
  statsRow.style.cssText = 'display: flex; justify-content: center; gap: var(--sp-6); margin-top: var(--sp-3);';

  const fardLabel = document.createElement('span');
  fardLabel.style.cssText = 'font-size: 0.8125rem; font-weight: 600; color: var(--accent);';
  fardLabel.textContent = `${fardDone}/5 Fard`;
  statsRow.appendChild(fardLabel);

  const sunnahLabel = document.createElement('span');
  sunnahLabel.style.cssText = 'font-size: 0.8125rem; color: var(--text-tertiary);';
  sunnahLabel.textContent = `${totalDone - fardDone}/6 Sunnah + Witr`;
  statsRow.appendChild(sunnahLabel);

  ringCard.appendChild(statsRow);
  container.appendChild(ringCard);

  // ----- Card 3: Prayer Timeline -----
  const timelineLabel = document.createElement('h3');
  timelineLabel.className = 'section-label';
  timelineLabel.textContent = "Today's Prayers";
  container.appendChild(timelineLabel);

  const timelineCard = document.createElement('div');
  timelineCard.className = 'card';

  const timeline = document.createElement('div');
  timeline.className = 'prayer-timeline';

  PRAYER_TIMES.forEach(time => {
    const timeHeader = document.createElement('div');
    timeHeader.style.cssText = 'font-weight: 600; font-size: 0.875rem; padding: var(--sp-3) 0 var(--sp-1); color: var(--text-primary);';
    timeHeader.textContent = time;
    timeline.appendChild(timeHeader);

    const prayersForTime = PRAYER_DEFS.filter(p => p.time === time);
    prayersForTime.forEach(prayer => {
      const isCompleted = !!todayData[prayer.key];

      const block = document.createElement('div');
      block.className = `prayer-block prayer-block--${prayer.type}`;
      if (isCompleted) block.classList.add('prayer-block--completed');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'display: flex; align-items: center; justify-content: space-between; width: 100%; padding: var(--sp-2) var(--sp-1); background: none; cursor: pointer; min-height: 44px;';
      btn.setAttribute('aria-pressed', isCompleted ? 'true' : 'false');

      const nameEl = document.createElement('span');
      nameEl.className = 'prayer-block__name';
      nameEl.textContent = prayer.name;
      btn.appendChild(nameEl);

      const rakahsEl = document.createElement('span');
      rakahsEl.className = 'prayer-block__time';
      rakahsEl.textContent = `${prayer.rakahs} rak'ah`;
      btn.appendChild(rakahsEl);

      btn.addEventListener('click', async () => {
        const newState = !block.classList.contains('prayer-block--completed');
        block.classList.toggle('prayer-block--completed', newState);
        btn.setAttribute('aria-pressed', newState ? 'true' : 'false');

        todayData[prayer.key] = newState;
        await updatePrayer(prayer.key, newState);

        // Recount and update stats
        fardDone = FARD_KEYS.filter(k => !!todayData[k]).length;
        totalDone = ALL_KEYS.filter(k => !!todayData[k]).length;
        completion = totalDone / ALL_KEYS.length;

        fardLabel.textContent = `${fardDone}/5 Fard`;
        sunnahLabel.textContent = `${totalDone - fardDone}/6 Sunnah + Witr`;

        // Update progress ring
        const ringLabel = ringWrap.querySelector('.progress-ring__label');
        if (ringLabel) ringLabel.textContent = String(totalDone);
        const ringProgress = ringWrap.querySelector('.progress-ring__progress');
        if (ringProgress) {
          const radius = 52;
          const circumference = 2 * Math.PI * radius;
          ringProgress.setAttribute('stroke-dashoffset', String(circumference * (1 - completion)));
        }
      });

      block.appendChild(btn);
      timeline.appendChild(block);
    });
  });

  timelineCard.appendChild(timeline);
  container.appendChild(timelineCard);

  // ----- Card 4: Weekly Heatmap -----
  const sortedDays = weekData.slice().sort((a, b) => a.date.localeCompare(b.date));
  if (sortedDays.length > 1) {
    const heatLabel = document.createElement('h3');
    heatLabel.className = 'section-label';
    heatLabel.textContent = 'This Week';
    container.appendChild(heatLabel);

    const heatCard = document.createElement('div');
    heatCard.className = 'card';
    heatCard.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; font-size: 0.75rem; border-collapse: collapse;';

    // Header row
    const thead = document.createElement('tr');
    const emptyTh = document.createElement('th');
    emptyTh.style.cssText = 'text-align: left; padding: var(--sp-1) var(--sp-2); color: var(--text-tertiary); width: 80px;';
    thead.appendChild(emptyTh);

    sortedDays.forEach(day => {
      const th = document.createElement('th');
      th.style.cssText = 'text-align: center; padding: var(--sp-1); color: var(--text-tertiary); font-weight: 500;';
      const d = new Date(day.date + 'T12:00:00');
      th.textContent = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
      thead.appendChild(th);
    });
    table.appendChild(thead);

    // One row per prayer
    PRAYER_DEFS.forEach(prayer => {
      const row = document.createElement('tr');
      const labelCell = document.createElement('td');
      labelCell.style.cssText = 'padding: var(--sp-1) var(--sp-2); white-space: nowrap;';
      if (prayer.type === 'fard') {
        labelCell.style.fontWeight = '600';
        labelCell.style.color = 'var(--accent)';
      } else {
        labelCell.style.color = 'var(--text-secondary)';
      }
      const displayName = prayer.name.length > 10 ? prayer.name.slice(0, 10) + '..' : prayer.name;
      labelCell.textContent = displayName;
      row.appendChild(labelCell);

      sortedDays.forEach(day => {
        const cell = document.createElement('td');
        cell.style.cssText = 'text-align: center; padding: var(--sp-1);';
        const dot = document.createElement('div');
        const done = !!day[prayer.key];
        dot.style.cssText = `width: 10px; height: 10px; border-radius: 50%; margin: 0 auto;`;
        if (done) {
          dot.style.background = prayer.type === 'fard' ? 'var(--accent)' : 'var(--success)';
        } else {
          dot.style.background = 'var(--bg-elevated)';
        }
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

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
