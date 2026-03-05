/**
 * lifts.js — Lift tracker: session selection, exercise logging, PRs, progressive overload
 */

import { WORKOUT_SPLIT, ABS_EXERCISES, LFT, SHEET_NAMES } from '../../config.js';
import { readRange, appendRow } from '../api.js';
import { cacheData, getCachedData, isOnline } from '../store.js';
import { showPRToast } from '../components/toast.js';

let selectedSession = null;
let allLiftData = [];
let todayEntries = [];

/**
 * Render the Lifts tab
 */
export async function renderLifts(firstLoad = false) {
  const panel = document.getElementById('tab-lifts');
  if (!panel) return;

  // Fetch all lift data
  try {
    const cached = await getCachedData('lifts-all');
    if (cached) allLiftData = cached;

    if (isOnline()) {
      const raw = await readRange(SHEET_NAMES.LIFTS, 'A2:J5000');
      allLiftData = raw.filter(r => r[0] && r[0] !== '');
      await cacheData('lifts-all', allLiftData);
    }
  } catch (e) {
    console.error('Lifts fetch error:', e);
  }

  // Get today's entries
  const today = new Date();
  todayEntries = allLiftData.filter(r => {
    const d = parseDate(r[0]);
    return d && isSameDay(d, today);
  });

  if (!selectedSession) {
    renderSessionSelector(panel);
  } else {
    renderSessionView(panel);
  }
}

function renderSessionSelector(panel) {
  const stats = getOverallStats();

  panel.innerHTML = `
    <div class="card" style="text-align:center;">
      <h2>Lift Tracker</h2>
      <p class="text-secondary">${formatDate(new Date())}</p>
    </div>

    <div class="card">
      <h3>Select Session</h3>
      <div style="display:grid;gap:0.75rem;margin-top:1rem;">
        ${WORKOUT_SPLIT.map((session, i) => `
          <button class="btn btn--primary btn--block session-btn" data-session="${i}" style="text-align:left;padding:1rem;">
            <div style="font-weight:700;">${session.name}</div>
            <div style="font-size:0.75rem;opacity:0.8;margin-top:0.25rem;">
              ${session.exercises.length > 0
                ? session.exercises.length + ' exercises + abs'
                : 'Freeform + abs'}
            </div>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h3>Stats</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:0.75rem;text-align:center;">
        <div>
          <div style="font-size:1.5rem;font-weight:700;font-family:'Space Mono',monospace;color:var(--accent-gold);">${stats.sessions}</div>
          <div class="text-secondary" style="font-size:0.7rem;">Sessions</div>
        </div>
        <div>
          <div style="font-size:1.5rem;font-weight:700;font-family:'Space Mono',monospace;color:var(--success);">${stats.prs}</div>
          <div class="text-secondary" style="font-size:0.7rem;">PRs</div>
        </div>
        <div>
          <div style="font-size:1.5rem;font-weight:700;font-family:'Space Mono',monospace;">${stats.totalSets}</div>
          <div class="text-secondary" style="font-size:0.7rem;">Total Sets</div>
        </div>
      </div>
    </div>

    ${todayEntries.length > 0 ? `
    <div class="card">
      <h3>Today's Log</h3>
      ${renderTodayLog()}
    </div>` : ''}
  `;

  // Session button handlers
  panel.querySelectorAll('.session-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSession = parseInt(btn.dataset.session);
      renderSessionView(panel);
    });
  });
}

function renderSessionView(panel) {
  const session = WORKOUT_SPLIT[selectedSession];
  const exercises = [...session.exercises, ...ABS_EXERCISES];

  panel.innerHTML = `
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h2 style="font-size:1.1rem;">${session.name}</h2>
        <p class="text-secondary" style="font-size:0.75rem;">${formatDate(new Date())}</p>
      </div>
      <button class="btn btn--outline" id="back-btn" style="font-size:0.8rem;">Back</button>
    </div>

    ${exercises.map(ex => {
      const lastSession = getLastSessionData(ex.name);
      const currentPR = getPRData(ex.name);

      return `
      <div class="card exercise-card" data-exercise="${ex.name}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <h4 style="margin:0;">${ex.name}</h4>
            ${ex.targetWeight ? `<span class="text-secondary" style="font-size:0.7rem;">Target: ${ex.targetWeight}lb x ${ex.targetReps}</span>` : ''}
          </div>
          ${currentPR ? `<span class="badge" style="font-size:0.65rem;">PR: ${currentPR.weight}lb x ${currentPR.reps}</span>` : ''}
        </div>
        ${lastSession ? `<div class="text-secondary" style="font-size:0.7rem;margin-top:0.25rem;">Last: ${lastSession.sets.map(s => s.weight + 'x' + s.reps).join(', ')}</div>` : ''}

        <div class="set-list" id="sets-${sanitize(ex.name)}" style="margin-top:0.75rem;">
          ${renderExistingSets(ex.name)}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:0.5rem;margin-top:0.5rem;align-items:center;">
          <input type="number" class="input set-weight" placeholder="Weight (lb)" value="${ex.targetWeight || ''}" style="font-size:0.85rem;">
          <input type="number" class="input set-reps" placeholder="Reps" value="${ex.targetReps || ''}" style="font-size:0.85rem;">
          <button class="btn btn--primary add-set-btn" data-exercise="${ex.name}" data-sets="${ex.sets}" style="padding:0.5rem 0.75rem;font-size:0.8rem;">+ Set</button>
        </div>
      </div>`;
    }).join('')}

    <div style="padding:1rem;">
      <button class="btn btn--primary btn--block" id="finish-session-btn" style="padding:1rem;">Finish Session</button>
    </div>
  `;

  // Back button
  panel.querySelector('#back-btn').addEventListener('click', () => {
    selectedSession = null;
    renderSessionSelector(panel);
  });

  // Add set buttons
  panel.querySelectorAll('.add-set-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.exercise-card');
      const exercise = btn.dataset.exercise;
      const weight = Number(card.querySelector('.set-weight').value) || 0;
      const reps = Number(card.querySelector('.set-reps').value) || 0;
      if (!weight || !reps) return;

      const setNum = countTodaySets(exercise) + 1;
      const todayStr = formatDateISO(new Date());

      // Check for PR
      const isPR = checkPR(exercise, weight, reps);

      // Log to sheet
      try {
        await appendRow(SHEET_NAMES.LIFTS, [
          todayStr, session.name, exercise, setNum,
          getTargetWeight(exercise), weight,
          getTargetReps(exercise), reps, '', ''
        ]);
      } catch (e) {
        console.error('Failed to log set:', e);
      }

      // Update local data
      todayEntries.push([todayStr, session.name, exercise, setNum, getTargetWeight(exercise), weight, getTargetReps(exercise), reps, '', '']);
      allLiftData.push([todayStr, session.name, exercise, setNum, getTargetWeight(exercise), weight, getTargetReps(exercise), reps, '', '']);

      // Update UI
      const setList = document.getElementById('sets-' + sanitize(exercise));
      if (setList) {
        const arrow = getProgressArrow(exercise, weight);
        setList.innerHTML += `
          <div class="exercise-row">
            <span class="exercise-row__set">Set ${setNum}</span>
            <span class="exercise-row__weight">${weight}lb</span>
            <span class="exercise-row__reps">x${reps}</span>
            <span class="exercise-row__arrow ${arrow.class}">${arrow.icon}</span>
          </div>`;
      }

      if (isPR) {
        showPRToast(exercise, weight, reps);
      }
    });
  });

  // Finish session
  panel.querySelector('#finish-session-btn').addEventListener('click', () => {
    selectedSession = null;
    renderSessionSelector(panel);
  });
}

function renderExistingSets(exercise) {
  const sets = todayEntries.filter(r => r[LFT.EXERCISE - 1] === exercise);
  if (sets.length === 0) return '';

  return sets.map(s => {
    const weight = Number(s[LFT.ACTUAL_WEIGHT - 1]) || 0;
    const reps = Number(s[LFT.ACTUAL_REPS - 1]) || 0;
    const setNum = Number(s[LFT.SET_NUM - 1]) || 0;
    const arrow = getProgressArrow(exercise, weight);
    return `
      <div class="exercise-row">
        <span class="exercise-row__set">Set ${setNum}</span>
        <span class="exercise-row__weight">${weight}lb</span>
        <span class="exercise-row__reps">x${reps}</span>
        <span class="exercise-row__arrow ${arrow.class}">${arrow.icon}</span>
      </div>`;
  }).join('');
}

function renderTodayLog() {
  const byExercise = {};
  for (const row of todayEntries) {
    const ex = row[LFT.EXERCISE - 1];
    if (!byExercise[ex]) byExercise[ex] = [];
    byExercise[ex].push(row);
  }

  return Object.entries(byExercise).map(([ex, sets]) =>
    `<div style="padding:0.5rem 0;border-bottom:1px solid var(--bg-elevated);">
      <div style="font-weight:500;font-size:0.85rem;">${ex}</div>
      <div class="text-secondary" style="font-size:0.7rem;">
        ${sets.map(s => (s[LFT.ACTUAL_WEIGHT - 1] || 0) + 'x' + (s[LFT.ACTUAL_REPS - 1] || 0)).join(' | ')}
      </div>
    </div>`
  ).join('');
}

function getLastSessionData(exercise) {
  const today = new Date();
  let lastDate = null;
  const sets = [];

  for (let i = allLiftData.length - 1; i >= 0; i--) {
    const row = allLiftData[i];
    if (row[LFT.EXERCISE - 1] !== exercise) continue;
    const d = parseDate(row[0]);
    if (!d || isSameDay(d, today)) continue;

    if (!lastDate) lastDate = d;
    if (lastDate && isSameDay(d, lastDate)) {
      sets.unshift({ weight: Number(row[LFT.ACTUAL_WEIGHT - 1]) || 0, reps: Number(row[LFT.ACTUAL_REPS - 1]) || 0 });
    } else if (lastDate) break;
  }
  return sets.length > 0 ? { date: lastDate, sets } : null;
}

function getPRData(exercise) {
  let best = null;
  let bestVol = 0;
  for (const row of allLiftData) {
    if (row[LFT.EXERCISE - 1] !== exercise) continue;
    const w = Number(row[LFT.ACTUAL_WEIGHT - 1]) || 0;
    const r = Number(row[LFT.ACTUAL_REPS - 1]) || 0;
    if (w * r > bestVol) {
      bestVol = w * r;
      best = { weight: w, reps: r };
    }
  }
  return best;
}

function checkPR(exercise, weight, reps) {
  const current = getPRData(exercise);
  if (!current) return true;
  return weight * reps > current.weight * current.reps;
}

function getProgressArrow(exercise, weight) {
  const last = getLastSessionData(exercise);
  if (!last || last.sets.length === 0) return { icon: '', class: '' };
  const lastWeight = last.sets[last.sets.length - 1].weight;
  if (weight > lastWeight) return { icon: '\u2191', class: 'exercise-row__arrow--up' };
  if (weight < lastWeight) return { icon: '\u2193', class: 'exercise-row__arrow--down' };
  return { icon: '\u2192', class: 'exercise-row__arrow--same' };
}

function countTodaySets(exercise) {
  return todayEntries.filter(r => r[LFT.EXERCISE - 1] === exercise).length;
}

function getTargetWeight(exercise) {
  for (const session of WORKOUT_SPLIT) {
    for (const ex of session.exercises) {
      if (ex.name === exercise) return ex.targetWeight || 0;
    }
  }
  for (const ex of ABS_EXERCISES) {
    if (ex.name === exercise) return ex.targetWeight || 0;
  }
  return 0;
}

function getTargetReps(exercise) {
  for (const session of WORKOUT_SPLIT) {
    for (const ex of session.exercises) {
      if (ex.name === exercise) return ex.targetReps || 0;
    }
  }
  for (const ex of ABS_EXERCISES) {
    if (ex.name === exercise) return ex.targetReps || 0;
  }
  return 0;
}

function getOverallStats() {
  const sessions = new Set();
  let bestByEx = {};
  let prs = 0;

  for (const row of allLiftData) {
    const d = row[0];
    const type = row[LFT.SESSION_TYPE - 1];
    if (d && type) sessions.add(d + '_' + type);

    const ex = row[LFT.EXERCISE - 1];
    const vol = (Number(row[LFT.ACTUAL_WEIGHT - 1]) || 0) * (Number(row[LFT.ACTUAL_REPS - 1]) || 0);
    if (ex && vol > 0) {
      if (!bestByEx[ex] || vol > bestByEx[ex]) {
        if (bestByEx[ex]) prs++;
        bestByEx[ex] = vol;
      }
    }
  }

  return { sessions: sessions.size, prs, totalSets: allLiftData.length };
}

function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '-');
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
