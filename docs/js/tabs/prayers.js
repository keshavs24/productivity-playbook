/**
 * prayers.js — Prayer tracker: timeline, fard+sunnah toggles, weekly heatmap
 */

import { PRAYERS, FARD_PRAYER_COLS, PRA, SHEET_NAMES } from '../../config.js';
import { readRange, writeRange, appendRow } from '../api.js';
import { cacheData, getCachedData, isOnline, queueWrite } from '../store.js';

const PRAYER_TIMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/**
 * Render the Prayers tab
 */
export async function renderPrayers(firstLoad = false) {
  const panel = document.getElementById('tab-prayers');
  if (!panel) return;

  // Fetch prayer data
  let todayData = null;
  let todayRow = -1;
  let weekData = [];

  try {
    const cached = await getCachedData('prayers-data');
    if (cached) {
      todayData = cached.todayData;
      todayRow = cached.todayRow;
      weekData = cached.weekData;
    }

    if (isOnline()) {
      const raw = await readRange(SHEET_NAMES.PRAYERS, 'A2:N500');
      const today = new Date();

      // Find today's row and last 7 days
      weekData = [];
      for (let i = 0; i < raw.length; i++) {
        const d = parseDate(raw[i][0]);
        if (!d) continue;

        if (isSameDay(d, today)) {
          todayData = raw[i];
          todayRow = i + 2; // 1-indexed + header
        }

        // Last 7 days
        const daysDiff = Math.floor((today - d) / 86400000);
        if (daysDiff >= 0 && daysDiff < 7) {
          weekData.push({ date: d, data: raw[i] });
        }
      }

      await cacheData('prayers-data', { todayData, todayRow, weekData });
    }
  } catch (e) {
    console.error('Prayer fetch error:', e);
  }

  // Parse today's prayer states
  const prayerStates = {};
  for (const prayer of PRAYERS) {
    const colIdx = prayer.col - 1; // 0-indexed
    prayerStates[prayer.name] = todayData
      ? (todayData[colIdx] === true || todayData[colIdx] === 'TRUE')
      : false;
  }

  // Count stats
  let fardDone = 0;
  let sunnahDone = 0;
  let totalDone = 0;
  for (const prayer of PRAYERS) {
    if (prayerStates[prayer.name]) {
      totalDone++;
      if (prayer.type === 'fard') fardDone++;
      else sunnahDone++;
    }
  }
  const completion = totalDone / PRAYERS.length;

  panel.innerHTML = `
    <div class="card" style="text-align:center;">
      <h2>Prayers</h2>
      <p class="text-secondary">${formatDate(new Date())}</p>
    </div>

    <div class="card" style="text-align:center;">
      <div style="display:inline-block;position:relative;">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-elevated)" stroke-width="6"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-gold)" stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="${2 * Math.PI * 42}"
            stroke-dashoffset="${2 * Math.PI * 42 * (1 - completion)}"
            transform="rotate(-90 50 50)"
            style="transition:stroke-dashoffset 0.5s ease;"/>
          <text x="50" y="46" text-anchor="middle" dominant-baseline="central"
            fill="var(--text-primary)" font-size="20" font-weight="700"
            font-family="'Space Mono',monospace">${totalDone}</text>
          <text x="50" y="62" text-anchor="middle" dominant-baseline="central"
            fill="var(--text-secondary)" font-size="9">/ ${PRAYERS.length}</text>
        </svg>
      </div>
      <div style="display:flex;justify-content:center;gap:2rem;margin-top:0.75rem;">
        <div>
          <div style="font-weight:700;color:var(--accent-gold);font-family:'Space Mono',monospace;">${fardDone}/5</div>
          <div class="text-secondary" style="font-size:0.7rem;">Fard</div>
        </div>
        <div>
          <div style="font-weight:700;color:var(--text-primary);font-family:'Space Mono',monospace;">${sunnahDone}/6</div>
          <div class="text-secondary" style="font-size:0.7rem;">Sunnah + Witr</div>
        </div>
      </div>
    </div>

    <div class="card prayer-timeline-card">
      <h3>Today's Prayers</h3>
      <div class="prayer-timeline" style="margin-top:1rem;">
        ${PRAYER_TIMES.map(time => {
          const prayers = PRAYERS.filter(p => p.time === time);
          return `
            <div class="prayer-time-block">
              <div class="prayer-time-label">${time}</div>
              <div class="prayer-time-prayers">
                ${prayers.map(p => {
                  const active = prayerStates[p.name];
                  const isFard = p.type === 'fard';
                  return `
                    <button class="prayer-btn ${isFard ? 'prayer-btn--fard' : 'prayer-btn--sunnah'} ${active ? 'prayer-btn--active' : ''}"
                      data-prayer="${p.name}" data-col="${p.col}"
                      aria-pressed="${active}" aria-label="${p.name} (${p.rakahs} rakahs)">
                      <span class="prayer-btn__dot"></span>
                      <span class="prayer-btn__label">${p.name.replace(time + ' ', '').replace('Before', 'B').replace('After', 'A')}</span>
                      <span class="prayer-btn__rakahs">${p.rakahs}r</span>
                    </button>`;
                }).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <div class="card">
      <h3>Weekly Heatmap</h3>
      <div style="overflow-x:auto;margin-top:0.75rem;">
        <table style="width:100%;border-collapse:collapse;font-size:0.7rem;">
          <thead>
            <tr>
              <th style="text-align:left;padding:0.25rem;color:var(--text-secondary);"></th>
              ${weekData.sort((a, b) => a.date - b.date).map(d =>
                `<th style="text-align:center;padding:0.25rem;color:var(--text-secondary);font-weight:500;">
                  ${d.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                </th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${PRAYERS.map(prayer => {
              const isFard = prayer.type === 'fard';
              return `<tr>
                <td style="padding:0.2rem 0.25rem;font-weight:${isFard ? '600' : '400'};color:${isFard ? 'var(--accent-gold)' : 'var(--text-secondary)'};">
                  ${prayer.name.length > 12 ? prayer.name.slice(0, 12) + '..' : prayer.name}
                </td>
                ${weekData.sort((a, b) => a.date - b.date).map(d => {
                  const val = d.data[prayer.col - 1];
                  const done = val === true || val === 'TRUE';
                  return `<td style="text-align:center;padding:0.2rem;">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${done ? (isFard ? 'var(--accent-gold)' : 'var(--success)') : 'var(--bg-elevated)'};"></span>
                  </td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Prayer toggle handlers
  panel.querySelectorAll('.prayer-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const prayerName = btn.dataset.prayer;
      const col = parseInt(btn.dataset.col);
      const currentState = btn.getAttribute('aria-pressed') === 'true';
      const newState = !currentState;

      // Update UI immediately
      btn.setAttribute('aria-pressed', String(newState));
      btn.classList.toggle('prayer-btn--active', newState);

      // Write to sheet
      if (todayRow > 0) {
        const cellRef = colLetter(col) + todayRow;
        try {
          if (isOnline()) {
            await writeRange(SHEET_NAMES.PRAYERS, cellRef, [[newState]]);
          } else {
            await queueWrite(SHEET_NAMES.PRAYERS, cellRef, [[newState]]);
          }
        } catch (e) {
          console.error('Prayer write error:', e);
        }
      } else {
        // Need to create a new row
        const todayStr = formatDateISO(new Date());
        const rowValues = [todayStr];
        for (let i = 0; i < PRAYERS.length; i++) {
          if (PRAYERS[i].name === prayerName) {
            rowValues.push(newState);
          } else {
            rowValues.push(false);
          }
        }
        try {
          await appendRow(SHEET_NAMES.PRAYERS, rowValues);
          // Refetch to get the row number
          const raw = await readRange(SHEET_NAMES.PRAYERS, 'A2:N500');
          todayRow = raw.length + 1; // Approximate
        } catch (e) {
          console.error('Prayer append error:', e);
        }
      }

      // Update stats in header
      updatePrayerStats(panel);
    });
  });
}

function updatePrayerStats(panel) {
  let fard = 0, sunnah = 0, total = 0;
  panel.querySelectorAll('.prayer-btn').forEach(btn => {
    if (btn.getAttribute('aria-pressed') === 'true') {
      total++;
      if (btn.classList.contains('prayer-btn--fard')) fard++;
      else sunnah++;
    }
  });
  // Quick re-render would be heavy; stats update on next full render
}

function colLetter(n) {
  let s = '';
  while (n > 0) {
    const mod = (n - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    n = Math.floor((n - mod) / 26);
  }
  return s;
}

function parseDate(val) {
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function formatDateISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
