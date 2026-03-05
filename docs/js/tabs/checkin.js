/**
 * checkin.js — Daily Check-in tab: habits, attributes, MRR, weight, diet, win-of-the-day
 */

import { HABITS, ATTRIBUTES, DL, SHEET_NAMES } from '../../config.js';
import { readRange, writeRange, updateCell } from '../api.js';
import { cacheData, getCachedData, queueWrite, isOnline } from '../store.js';
import { isToday, parseSheetDate, calculateDailyXP } from '../engine.js';

const CACHE_KEY = 'checkin-today';

/** Convert 1-indexed column number to spreadsheet letter (1 -> A, 27 -> AA). */
function colLetter(n) {
  let s = '';
  while (n > 0) {
    const mod = (n - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    n = Math.floor((n - mod) / 26);
  }
  return s;
}

/** Persist a single cell to the sheet (or queue if offline). */
async function persistCell(rowNum, col, value) {
  const cell = `${colLetter(col)}${rowNum}`;
  if (isOnline()) {
    try {
      await updateCell(SHEET_NAMES.DAILY_LOG, cell, value);
    } catch (err) {
      console.error('Write failed, queuing:', err);
      await queueWrite(SHEET_NAMES.DAILY_LOG, cell, [[value]]);
    }
  } else {
    await queueWrite(SHEET_NAMES.DAILY_LOG, cell, [[value]]);
  }
}

/** Format today's date for display. */
function formatToday() {
  const d = new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * Build a star-rating component.
 * @param {string} name  - label shown above the stars
 * @param {string} group - unique radio-group name
 * @param {number} value - current rating 0-5
 * @param {function} onChange - callback(newValue)
 * @returns {HTMLElement}
 */
function buildStarRating(name, group, value, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'star-rating';

  const label = document.createElement('span');
  label.className = 'star-rating-label';
  label.textContent = name;
  wrap.appendChild(label);

  const starsWrap = document.createElement('div');
  starsWrap.className = 'star-rating-stars';

  for (let i = 1; i <= 5; i++) {
    const id = `${group}-${i}`;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = group;
    radio.id = id;
    radio.value = i;
    radio.checked = i === value;

    const star = document.createElement('label');
    star.htmlFor = id;
    star.textContent = '\u2605';
    star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);

    radio.addEventListener('change', () => onChange(i));

    starsWrap.appendChild(radio);
    starsWrap.appendChild(star);
  }

  wrap.appendChild(starsWrap);
  return wrap;
}

/**
 * Main render function — called by app.js tab router.
 * @param {boolean} firstLoad - true on initial tab visit
 */
export async function renderCheckin(firstLoad = false) {
  const container = document.getElementById('tab-checkin');
  if (!container) return;

  // ------------------------------------------------------------------
  // 1. Fetch (or cache) today's row
  // ------------------------------------------------------------------
  let rowData = null;
  let rowNum = null;

  if (firstLoad) {
    // Try cache first
    const cached = await getCachedData(CACHE_KEY, 2 * 60 * 1000);
    if (cached) {
      rowData = cached.rowData;
      rowNum = cached.rowNum;
    }

    if (!rowData) {
      try {
        // Fetch the last 7 rows to find today
        const rows = await readRange(SHEET_NAMES.DAILY_LOG, 'A2:AF500');
        if (rows && rows.length > 0) {
          for (let i = rows.length - 1; i >= 0; i--) {
            if (isToday(rows[i][DL.DATE - 1])) {
              rowData = rows[i];
              rowNum = i + 2; // +2 for 1-indexed header offset
              break;
            }
          }
          // Cache yesterday's MRR for pre-fill if no today row
          if (!rowData && rows.length > 0) {
            const yesterday = rows[rows.length - 1];
            rowData = null;
            // Store yesterday MRR for default
            container._yesterdayMRR = yesterday[DL.MRR - 1] || '';
          }
        }
      } catch (err) {
        console.error('Failed to fetch daily log:', err);
      }
    }

    if (rowData) {
      await cacheData(CACHE_KEY, { rowData, rowNum });
    }
  }

  // ------------------------------------------------------------------
  // 2. Parse existing values (defaults if no row yet)
  // ------------------------------------------------------------------
  const habits = [];
  for (let c = DL.HABIT_START; c <= DL.HABIT_END; c++) {
    const val = rowData ? rowData[c - 1] : null;
    habits.push(val === true || val === 'TRUE');
  }

  const attrs = [];
  for (let c = DL.ATTR_START; c <= DL.ATTR_END; c++) {
    const val = rowData ? Number(rowData[c - 1]) : 0;
    attrs.push(isNaN(val) ? 0 : val);
  }

  const mrr = rowData ? (rowData[DL.MRR - 1] || container._yesterdayMRR || '') : (container._yesterdayMRR || '');
  const win = rowData ? (rowData[DL.WIN_OF_DAY - 1] || '') : '';
  const dietScore = rowData ? (Number(rowData[DL.DIET_SCORE - 1]) || 0) : 0;
  const weight = rowData ? (rowData[DL.WEIGHT - 1] || '') : '';
  const completed = rowData ? (rowData[DL.COMPLETED - 1] === true || rowData[DL.COMPLETED - 1] === 'TRUE') : false;

  // ------------------------------------------------------------------
  // 3. Build the UI
  // ------------------------------------------------------------------
  container.innerHTML = '';

  // --- Date header ---
  const dateHeader = document.createElement('h2');
  dateHeader.className = 'checkin-date';
  dateHeader.textContent = formatToday();
  container.appendChild(dateHeader);

  // --- Habit Toggles ---
  const habitsCard = document.createElement('div');
  habitsCard.className = 'card';
  habitsCard.innerHTML = '<h3>Habits</h3>';

  const habitsGrid = document.createElement('div');
  habitsGrid.className = 'habits-grid';

  HABITS.forEach((name, idx) => {
    const btn = document.createElement('button');
    btn.className = 'habit-toggle';
    btn.textContent = name;
    btn.setAttribute('aria-pressed', String(habits[idx]));
    if (habits[idx]) btn.classList.add('active');

    btn.addEventListener('click', () => {
      habits[idx] = !habits[idx];
      btn.classList.toggle('active', habits[idx]);
      btn.setAttribute('aria-pressed', String(habits[idx]));
      const col = DL.HABIT_START + idx;
      if (rowNum) persistCell(rowNum, col, habits[idx] ? 'TRUE' : 'FALSE');
    });

    habitsGrid.appendChild(btn);
  });

  habitsCard.appendChild(habitsGrid);
  container.appendChild(habitsCard);

  // --- Attribute Star Ratings ---
  const attrsCard = document.createElement('div');
  attrsCard.className = 'card';
  attrsCard.innerHTML = '<h3>Attributes</h3>';

  ATTRIBUTES.forEach((name, idx) => {
    const rating = buildStarRating(name, `attr-${idx}`, attrs[idx], (val) => {
      attrs[idx] = val;
      const col = DL.ATTR_START + idx;
      if (rowNum) persistCell(rowNum, col, val);
    });
    attrsCard.appendChild(rating);
  });

  container.appendChild(attrsCard);

  // --- MRR Input ---
  const mrrCard = document.createElement('div');
  mrrCard.className = 'card';
  mrrCard.innerHTML = '<h3>MRR ($)</h3>';

  const mrrInput = document.createElement('input');
  mrrInput.type = 'number';
  mrrInput.className = 'checkin-input';
  mrrInput.placeholder = 'Monthly Recurring Revenue';
  mrrInput.value = mrr;
  mrrInput.addEventListener('change', () => {
    if (rowNum) persistCell(rowNum, DL.MRR, mrrInput.value);
  });

  mrrCard.appendChild(mrrInput);
  container.appendChild(mrrCard);

  // --- Win of the Day ---
  const winCard = document.createElement('div');
  winCard.className = 'card';
  winCard.innerHTML = '<h3>Win of the Day</h3>';

  const winInput = document.createElement('textarea');
  winInput.className = 'checkin-input checkin-textarea';
  winInput.placeholder = 'What was your biggest win today?';
  winInput.value = win;
  winInput.rows = 3;
  winInput.addEventListener('change', () => {
    if (rowNum) persistCell(rowNum, DL.WIN_OF_DAY, winInput.value);
  });

  winCard.appendChild(winInput);
  container.appendChild(winCard);

  // --- Diet Score ---
  const dietCard = document.createElement('div');
  dietCard.className = 'card';
  dietCard.innerHTML = '<h3>Diet Score</h3>';

  const dietRating = buildStarRating('Rate your diet today', 'diet', dietScore, (val) => {
    if (rowNum) persistCell(rowNum, DL.DIET_SCORE, val);
  });

  dietCard.appendChild(dietRating);
  container.appendChild(dietCard);

  // --- Weight Quick Entry ---
  const weightCard = document.createElement('div');
  weightCard.className = 'card';
  weightCard.innerHTML = '<h3>Weight (lbs)</h3>';

  const weightInput = document.createElement('input');
  weightInput.type = 'number';
  weightInput.className = 'checkin-input';
  weightInput.placeholder = 'Morning weight';
  weightInput.step = '0.1';
  weightInput.value = weight;
  weightInput.addEventListener('change', () => {
    if (rowNum) persistCell(rowNum, DL.WEIGHT, weightInput.value);
  });

  weightCard.appendChild(weightInput);
  container.appendChild(weightCard);

  // --- Mark Day Complete ---
  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn-complete';
  completeBtn.textContent = completed ? 'Day Completed' : 'Mark Day Complete';
  if (completed) completeBtn.classList.add('completed');

  completeBtn.addEventListener('click', () => {
    completeBtn.textContent = 'Day Completed';
    completeBtn.classList.add('completed');
    if (rowNum) persistCell(rowNum, DL.COMPLETED, 'TRUE');
  });

  container.appendChild(completeBtn);
}
