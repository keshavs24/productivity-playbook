/**
 * dashboard.js — Dashboard tab renderer for the gamified productivity PWA
 *
 * Sections rendered:
 *  1. XP Progress Ring (level + title)
 *  2. Streak Counter (fire icon, size scales with streak length)
 *  3. This Week's Habit Grid (7 habits x 7 days)
 *  4. Boss Battles (body fat, $30K MRR, $100K MRR)
 *  5. Character Stats Radar Chart (6 attributes, 7-day avg)
 *  6. Recent Achievements (latest 3 earned badges)
 *  7. Weekly XP Total
 *  8. Wisdom Quote
 */

import { HABITS, ATTRIBUTES, GOALS, CUT, DL, SHEET_NAMES } from '../../config.js';
import { readRange, batchRead } from '../api.js';
import { cacheData, getCachedData } from '../store.js';
import {
  getLevelFromXP, getLevelTitle, getLevelProgress, getStreakMultiplier,
  calculateStreak, formatCurrency, daysUntil, parseSheetDate, isToday
} from '../engine.js';
import { createProgressRing } from '../components/progress-ring.js';
import { createRadarChart } from '../components/radar-chart.js';

const CACHE_KEY = 'dashboard';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function renderDashboard(firstLoad = false) {
  const container = document.getElementById('tab-dashboard');
  if (!container) return;

  // 1. Try cached data for instant render
  let data = await getCachedData(CACHE_KEY);
  if (data) {
    paint(container, data);
  }

  // 2. Fetch fresh data (always, but non-blocking if cache was used)
  try {
    data = await fetchDashboardData();
    await cacheData(CACHE_KEY, data);
    paint(container, data);
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    if (!data) {
      container.innerHTML = `<div class="card" style="text-align:center;padding:2rem;">
        <p style="color:var(--error)">Could not load dashboard.</p>
        <p style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.5rem;">${err.message}</p>
      </div>`;
    }
  }
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchDashboardData() {
  const dlRange = `${SHEET_NAMES.DAILY_LOG}!A2:AF`;
  const achRange = `${SHEET_NAMES.ACHIEVEMENTS}!A2:G`;
  const wisRange = `${SHEET_NAMES.WISDOM}!A2:D`;
  const bcRange = `${SHEET_NAMES.BODY_COMP}!A2:C`;

  const [dlRows, achRows, wisRows, bcRows] = await batchRead([dlRange, achRange, wisRange, bcRange]);

  // Trim to last 30 log rows for performance
  const logData = dlRows.length > 30 ? dlRows.slice(dlRows.length - 30) : dlRows;
  const allLogData = dlRows; // keep full set for weekly XP calc

  return {
    logData,
    allLogData,
    achRows,
    wisRows,
    bcRows
  };
}

// ---------------------------------------------------------------------------
// Painting
// ---------------------------------------------------------------------------

function paint(container, data) {
  const { logData, allLogData, achRows, wisRows, bcRows } = data;
  const latest = logData.length > 0 ? logData[logData.length - 1] : null;

  // --- Core stats ---
  const totalXP = latest ? (Number(latest[DL.TOTAL_XP - 1]) || 0) : 0;
  const level = getLevelFromXP(totalXP);
  const title = getLevelTitle(level);
  const progress = getLevelProgress(totalXP);
  const streak = latest ? (Number(latest[DL.STREAK - 1]) || 0) : 0;
  const multiplier = getStreakMultiplier(streak);
  const currentMRR = getLatestNonEmpty(logData, DL.MRR - 1);
  const latestBF = getLatestBodyFat(logData, bcRows);

  // --- Derived data ---
  const weekHabits = buildWeekHabitData(logData);
  const attrAvgs = computeAttributeAverages(logData);
  const weekXP = computeWeeklyXP(allLogData);
  const recentBadges = getRecentBadges(achRows);
  const wisdom = pickWisdom(wisRows, logData);

  // --- Build HTML ---
  const sections = [];

  // 1. XP Progress Ring
  sections.push(`
    <div class="card" style="text-align:center;">
      ${createProgressRing(progress, level, title, 130)}
      <div style="margin-top:0.5rem;color:var(--text-secondary);font-size:0.8rem;">
        ${totalXP.toLocaleString()} XP${multiplier > 1 ? ` &middot; ${multiplier}x streak bonus` : ''}
      </div>
    </div>
  `);

  // 2. Streak Counter
  sections.push(renderStreak(streak));

  // 3. Habit Grid
  sections.push(renderHabitGrid(weekHabits));

  // 4. Boss Battles
  sections.push(renderBossBattles(currentMRR, latestBF));

  // 5. Radar Chart placeholder — canvas inserted after innerHTML set
  sections.push(`
    <div class="card">
      <h3 style="margin:0 0 0.75rem;">Character Stats</h3>
      <div id="radar-chart-slot" style="display:flex;justify-content:center;"></div>
    </div>
  `);

  // 6. Recent Achievements
  sections.push(renderAchievements(recentBadges));

  // 7. Weekly XP
  sections.push(`
    <div class="card" style="text-align:center;">
      <h3 style="margin:0 0 0.25rem;">This Week</h3>
      <span style="font-size:1.5rem;font-weight:700;color:var(--accent-gold);">${weekXP.toLocaleString()} XP</span>
    </div>
  `);

  // 8. Wisdom Quote
  sections.push(renderWisdom(wisdom));

  container.innerHTML = sections.join('');

  // Insert canvas for radar chart (needs DOM)
  const slot = document.getElementById('radar-chart-slot');
  if (slot) {
    slot.innerHTML = '';
    slot.appendChild(createRadarChart(attrAvgs, 240));
  }
}

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

function renderStreak(streak) {
  let icon = '\u2728'; // sparkles
  let sizeClass = '';
  let glowClass = '';

  if (streak >= 90) { icon = '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25'; sizeClass = 'streak-epic'; }
  else if (streak >= 30) { icon = '\uD83D\uDD25\uD83D\uDD25'; sizeClass = 'streak-legendary'; }
  else if (streak >= 14) { icon = '\uD83D\uDD25'; sizeClass = 'streak-great'; }
  else if (streak >= 7) { icon = '\uD83D\uDD25'; sizeClass = 'streak-good'; }
  else if (streak === 0) { icon = '\uD83D\uDC80'; }

  if (streak >= 7) glowClass = ' streak-glow';

  const fontSize = streak >= 30 ? '2.5rem' : streak >= 14 ? '2rem' : streak >= 7 ? '1.75rem' : '1.5rem';

  return `
    <div class="card${glowClass}" style="text-align:center;">
      <div style="font-size:${fontSize};" class="${sizeClass}">${icon} ${streak}-day streak</div>
    </div>
  `;
}

function renderHabitGrid(weekData) {
  const { days, grid } = weekData;
  let headerCells = '<th></th>';
  for (let d = 0; d < 7; d++) {
    const isToday_ = days[d] && isToday(days[d].date);
    headerCells += `<th style="font-size:0.7rem;${isToday_ ? 'color:var(--accent-gold);font-weight:700;' : ''}">${DAY_NAMES[d]}</th>`;
  }

  let rows = '';
  for (let h = 0; h < HABITS.length; h++) {
    let cells = `<td style="font-size:0.75rem;text-align:left;white-space:nowrap;padding-right:0.5rem;">${HABITS[h]}</td>`;
    for (let d = 0; d < 7; d++) {
      const val = grid[h][d];
      if (val === 'done') {
        cells += '<td style="color:var(--success);font-weight:700;text-align:center;">\u2713</td>';
      } else if (val === 'missed') {
        cells += '<td style="color:var(--error);text-align:center;">\u2717</td>';
      } else {
        cells += '<td style="color:var(--text-secondary);text-align:center;">\u00B7</td>';
      }
    }
    rows += `<tr>${cells}</tr>`;
  }

  return `
    <div class="card">
      <h3 style="margin:0 0 0.75rem;">This Week's Habits</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-family:'Space Mono',monospace;">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderBossBattles(currentMRR, latestBF) {
  const battles = [];

  // Body fat
  const bfProgress = (latestBF > 0 && CUT.START_BF > CUT.TARGET_BF)
    ? Math.min(1, Math.max(0, (CUT.START_BF - latestBF) / (CUT.START_BF - CUT.TARGET_BF)))
    : 0;
  const bfLabel = latestBF > 0
    ? `${latestBF.toFixed(1)}% \u2192 ${CUT.TARGET_BF}%`
    : 'Log body fat to track';
  battles.push({ label: '\uD83D\uDCAA 6-Pack', progress: bfProgress, detail: bfLabel, daysLeft: null });

  // $30K MRR
  const mrr30 = GOALS.mrr30k.target > 0 ? Math.min(1, currentMRR / GOALS.mrr30k.target) : 0;
  const days30 = Math.max(0, daysUntil(GOALS.mrr30k.deadline));
  battles.push({
    label: '\uD83D\uDCB0 $30K MRR',
    progress: mrr30,
    detail: `${formatCurrency(currentMRR)} / $30K`,
    daysLeft: days30
  });

  // $100K MRR
  const mrr100 = GOALS.mrr100k.target > 0 ? Math.min(1, currentMRR / GOALS.mrr100k.target) : 0;
  const days100 = Math.max(0, daysUntil(GOALS.mrr100k.deadline));
  battles.push({
    label: '\uD83D\uDE80 $100K MRR',
    progress: mrr100,
    detail: `${formatCurrency(currentMRR)} / $100K`,
    daysLeft: days100
  });

  let html = '<div class="card"><h3 style="margin:0 0 0.75rem;">Boss Battles</h3>';
  for (const b of battles) {
    const pct = Math.round(b.progress * 100);
    const daysStr = b.daysLeft !== null ? ` &middot; ${b.daysLeft}d left` : '';
    html += `
      <div style="margin-bottom:0.75rem;">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.25rem;">
          <span>${b.label}</span>
          <span style="color:var(--text-secondary);">${b.detail}${daysStr}</span>
        </div>
        <div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:var(--accent-gold);border-radius:4px;transition:width 0.4s;"></div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function renderAchievements(badges) {
  if (badges.length === 0) {
    return `
      <div class="card" style="text-align:center;">
        <h3 style="margin:0 0 0.5rem;">Recent Achievements</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem;">\uD83C\uDFC6 No badges earned yet. Keep going!</p>
      </div>
    `;
  }

  let items = '';
  for (const b of badges) {
    items += `
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
        <span style="font-size:1.4rem;">${b.icon}</span>
        <div>
          <div style="font-weight:600;font-size:0.85rem;">${b.name}</div>
          <div style="font-size:0.7rem;color:var(--text-secondary);">${b.date}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="card">
      <h3 style="margin:0 0 0.75rem;">Recent Achievements</h3>
      ${items}
    </div>
  `;
}

function renderWisdom(wisdom) {
  if (!wisdom) return '';
  return `
    <div class="card" style="text-align:center;font-style:italic;">
      <p style="margin:0 0 0.25rem;color:var(--text-primary);font-size:0.85rem;">"${wisdom.text}"</p>
      <p style="margin:0;color:var(--text-secondary);font-size:0.75rem;">\u2014 ${wisdom.source}</p>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

function getLatestNonEmpty(rows, colIdx) {
  for (let i = rows.length - 1; i >= 0; i--) {
    const v = Number(rows[i][colIdx]);
    if (v && v > 0) return v;
  }
  return 0;
}

function getLatestBodyFat(logRows, bcRows) {
  // Try Body Comp sheet first (more recent)
  if (bcRows && bcRows.length > 0) {
    for (let i = bcRows.length - 1; i >= 0; i--) {
      const bf = Number(bcRows[i][2]); // col C = body fat %
      if (bf > 0) return bf;
    }
  }
  // Fallback to Daily Log body fat column
  return getLatestNonEmpty(logRows, DL.BODY_FAT - 1);
}

function buildWeekHabitData(logData) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + mondayOffset);

  const days = [];
  for (let d = 0; d < 7; d++) {
    const dt = new Date(monday.getTime() + d * 86400000);
    days.push({ date: dt, isFuture: dt > today });
  }

  // grid[habitIdx][dayIdx] = 'done' | 'missed' | 'future'
  const grid = [];
  for (let h = 0; h < HABITS.length; h++) {
    grid.push(new Array(7).fill('future'));
  }

  for (let d = 0; d < 7; d++) {
    if (days[d].isFuture) continue;

    const dayDate = days[d].date;
    const row = findRowForDate(logData, dayDate);

    for (let h = 0; h < HABITS.length; h++) {
      if (!row) {
        grid[h][d] = 'missed';
      } else {
        const val = row[DL.HABIT_START - 1 + h];
        grid[h][d] = (val === true || val === 'TRUE') ? 'done' : 'missed';
      }
    }
  }

  return { days, grid };
}

function findRowForDate(logData, targetDate) {
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  for (let i = logData.length - 1; i >= 0; i--) {
    const d = parseSheetDate(logData[i][DL.DATE - 1]);
    if (!d) continue;
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === target.getTime()) return logData[i];
  }
  return null;
}

function computeAttributeAverages(logData) {
  const last7 = logData.slice(Math.max(0, logData.length - 7));
  const avgs = [];

  for (let a = 0; a < ATTRIBUTES.length; a++) {
    let sum = 0;
    let count = 0;
    for (const row of last7) {
      const v = Number(row[DL.ATTR_START - 1 + a]);
      if (v >= 1 && v <= 5) { sum += v; count++; }
    }
    avgs.push(count > 0 ? Math.round((sum / count) * 10) / 10 : 0);
  }

  return avgs;
}

function computeWeeklyXP(allLogData) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + mondayOffset);

  let total = 0;
  for (const row of allLogData) {
    const d = parseSheetDate(row[DL.DATE - 1]);
    if (!d) continue;
    d.setHours(0, 0, 0, 0);
    if (d >= monday) {
      total += Number(row[DL.XP_EARNED - 1]) || 0;
    }
  }
  return total;
}

function getRecentBadges(achRows) {
  const earned = [];
  for (const row of achRows) {
    // Columns: icon(0), name(1), desc(2), category(3), xp(4), dateEarned(5), earned?(6)
    const isEarned = row[6] === true || row[6] === 'TRUE';
    if (isEarned && row[5]) {
      const d = parseSheetDate(row[5]);
      const dateStr = d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      earned.push({ icon: row[0] || '\uD83C\uDFC5', name: row[1] || 'Badge', date: dateStr, ts: d ? d.getTime() : 0 });
    }
  }
  earned.sort((a, b) => b.ts - a.ts);
  return earned.slice(0, 3);
}

function pickWisdom(wisRows, logData) {
  if (!wisRows || wisRows.length === 0) return null;

  // Determine trigger from yesterday's performance
  let trigger = 'general';
  if (logData.length > 0) {
    const latest = logData[logData.length - 1];
    const habitsScore = Number(latest[DL.HABITS_SCORE - 1]) || 0;
    const completed = latest[DL.COMPLETED - 1];

    if (habitsScore === HABITS.length) trigger = 'perfect_day';
    else if (!completed && completed !== 'TRUE') trigger = 'negative';
    else if (habitsScore <= 2) trigger = 'negative';
    else trigger = 'positive';
  }

  // Filter by trigger, fallback to general
  // Wisdom columns: text(0), source(1), category(2), trigger(3)
  let pool = wisRows.filter(r => r[3] === trigger);
  if (pool.length === 0) pool = wisRows.filter(r => r[3] === 'general');
  if (pool.length === 0) pool = wisRows;

  // Deterministic daily pick using day-of-year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  const idx = dayOfYear % pool.length;

  return { text: pool[idx][0], source: pool[idx][1] };
}
