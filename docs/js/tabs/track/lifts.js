/**
 * track/lifts.js — Workout/lift tracker sub-tab
 * Session selection, set logging, PR detection, progressive overload arrows.
 */

import { WORKOUT_SPLIT, ABS_EXERCISES } from '../../../config.js';
import { addLiftEntry, getTodayLifts, getAllLifts } from '../../firebase.js';
import { showToast } from '../../app.js';

let selectedSession = null;
let allLiftData = [];
let todayEntries = [];

export async function renderLiftsSubTab(container) {
  container.textContent = '';

  todayEntries = await getTodayLifts();
  const raw = await getAllLifts();
  allLiftData = [...raw].reverse();

  if (selectedSession !== null) {
    renderSessionView(container);
  } else {
    renderSessionSelector(container);
  }
}

function renderSessionSelector(container) {
  // Header
  const headerCard = document.createElement('div');
  headerCard.className = 'card';
  headerCard.style.textAlign = 'center';
  const title = document.createElement('h2');
  title.textContent = 'Lift Tracker';
  headerCard.appendChild(title);
  const dateEl = document.createElement('div');
  dateEl.className = 'text-muted';
  dateEl.style.marginTop = 'var(--sp-1)';
  dateEl.textContent = formatDate(new Date());
  headerCard.appendChild(dateEl);
  container.appendChild(headerCard);

  // Session selector
  const sessLabel = document.createElement('h3');
  sessLabel.className = 'section-label';
  sessLabel.textContent = 'Select Session';
  container.appendChild(sessLabel);

  const grid = document.createElement('div');
  grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3);';

  WORKOUT_SPLIT.forEach((session, i) => {
    const card = document.createElement('div');
    card.className = 'card card--interactive';
    card.style.cursor = 'pointer';

    const name = document.createElement('div');
    name.style.cssText = 'font-weight: 600; font-size: 0.9375rem; margin-bottom: var(--sp-1);';
    name.textContent = session.name;
    card.appendChild(name);

    const count = document.createElement('div');
    count.className = 'text-muted';
    count.style.fontSize = '0.75rem';
    const exCount = session.exercises.length;
    count.textContent = exCount > 0 ? `${exCount} exercises + abs` : 'Freeform + abs';
    card.appendChild(count);

    card.addEventListener('click', () => {
      selectedSession = i;
      renderLiftsSubTab(container);
    });

    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Stats
  const statsLabel = document.createElement('h3');
  statsLabel.className = 'section-label';
  statsLabel.textContent = 'Stats';
  container.appendChild(statsLabel);

  const statsCard = document.createElement('div');
  statsCard.className = 'card';

  const stats = getOverallStats();
  const statsGrid = document.createElement('div');
  statsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-4); text-align: center;';

  [
    { label: 'Sessions', value: stats.sessions, color: 'var(--accent)' },
    { label: 'PRs', value: stats.prs, color: 'var(--success)' },
    { label: 'Total Sets', value: stats.totalSets, color: 'var(--text-primary)' },
  ].forEach(s => {
    const col = document.createElement('div');
    const val = document.createElement('div');
    val.className = 'data-value';
    val.style.cssText = `font-size: 1.5rem; color: ${s.color};`;
    val.textContent = s.value;
    col.appendChild(val);
    const lbl = document.createElement('div');
    lbl.className = 'text-muted';
    lbl.style.fontSize = '0.7rem';
    lbl.textContent = s.label;
    col.appendChild(lbl);
    statsGrid.appendChild(col);
  });

  statsCard.appendChild(statsGrid);
  container.appendChild(statsCard);

  // Today's log
  if (todayEntries.length > 0) {
    const logLabel = document.createElement('h3');
    logLabel.className = 'section-label';
    logLabel.textContent = "Today's Log";
    container.appendChild(logLabel);

    const logCard = document.createElement('div');
    logCard.className = 'card';

    const byExercise = {};
    todayEntries.forEach(e => {
      if (!byExercise[e.exercise]) byExercise[e.exercise] = [];
      byExercise[e.exercise].push(e);
    });

    Object.entries(byExercise).forEach(([ex, sets]) => {
      const row = document.createElement('div');
      row.style.cssText = 'padding: var(--sp-2) 0; border-bottom: 1px solid var(--bg-subtle);';
      const exName = document.createElement('div');
      exName.style.cssText = 'font-weight: 500; font-size: 0.85rem;';
      exName.textContent = ex;
      row.appendChild(exName);
      const setsStr = document.createElement('div');
      setsStr.className = 'text-muted';
      setsStr.style.fontSize = '0.7rem';
      setsStr.textContent = sets.map(s => `${s.weight}x${s.reps}`).join(' | ');
      row.appendChild(setsStr);
      logCard.appendChild(row);
    });

    container.appendChild(logCard);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}

function renderSessionView(container) {
  const session = WORKOUT_SPLIT[selectedSession];
  const exercises = [...session.exercises, ...ABS_EXERCISES];

  // Header
  const headerCard = document.createElement('div');
  headerCard.className = 'card';
  const headerRow = document.createElement('div');
  headerRow.className = 'row row--between';

  const headerLeft = document.createElement('div');
  const sessionTitle = document.createElement('h2');
  sessionTitle.style.fontSize = '1.1rem';
  sessionTitle.textContent = session.name;
  headerLeft.appendChild(sessionTitle);
  const sessionDate = document.createElement('div');
  sessionDate.className = 'text-muted';
  sessionDate.style.fontSize = '0.75rem';
  sessionDate.textContent = formatDate(new Date());
  headerLeft.appendChild(sessionDate);
  headerRow.appendChild(headerLeft);

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn btn--secondary';
  backBtn.style.fontSize = '0.8rem';
  backBtn.textContent = 'Back';
  backBtn.addEventListener('click', () => {
    selectedSession = null;
    renderLiftsSubTab(container);
  });
  headerRow.appendChild(backBtn);

  headerCard.appendChild(headerRow);
  container.appendChild(headerCard);

  // Per-exercise cards
  exercises.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-3)';

    // Exercise header
    const exHeaderRow = document.createElement('div');
    exHeaderRow.className = 'row row--between';
    exHeaderRow.style.marginBottom = 'var(--sp-2)';

    const exNameWrap = document.createElement('div');
    const exName = document.createElement('div');
    exName.style.cssText = 'font-weight: 600; font-size: 0.9375rem;';
    exName.textContent = exercise.name;
    exNameWrap.appendChild(exName);

    if (exercise.targetWeight) {
      const targetInfo = document.createElement('div');
      targetInfo.className = 'text-muted';
      targetInfo.style.fontSize = '0.7rem';
      targetInfo.textContent = `Target: ${exercise.targetWeight}lb x ${exercise.targetReps}`;
      exNameWrap.appendChild(targetInfo);
    }
    exHeaderRow.appendChild(exNameWrap);

    const pr = getPRData(exercise.name);
    if (pr) {
      const prBadge = document.createElement('span');
      prBadge.style.cssText = 'font-size: 0.6875rem; color: var(--accent); font-weight: 600;';
      prBadge.textContent = `PR: ${pr.weight}lb x ${pr.reps}`;
      exHeaderRow.appendChild(prBadge);
    }

    card.appendChild(exHeaderRow);

    // Last session reference
    const lastData = getLastSessionData(exercise.name);
    if (lastData) {
      const lastRef = document.createElement('div');
      lastRef.className = 'text-muted';
      lastRef.style.cssText = 'font-size: 0.7rem; margin-bottom: var(--sp-2);';
      lastRef.textContent = 'Last: ' + lastData.sets.map(s => `${s.weight}x${s.reps}`).join(', ');
      card.appendChild(lastRef);
    }

    // Existing today's sets
    const exTodaySets = todayEntries.filter(e => e.exercise === exercise.name);
    const setList = document.createElement('div');
    setList.id = 'sets-' + sanitize(exercise.name);

    exTodaySets.forEach((s, i) => {
      setList.appendChild(createSetRow(i + 1, s.weight, s.reps, exercise.name));
    });

    card.appendChild(setList);

    // Add set inputs
    const addRow = document.createElement('div');
    addRow.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-top: var(--sp-3);';

    const weightIn = document.createElement('input');
    weightIn.type = 'number';
    weightIn.className = 'exercise-row__input';
    weightIn.placeholder = 'lbs';
    weightIn.value = exercise.targetWeight || '';

    const repsIn = document.createElement('input');
    repsIn.type = 'number';
    repsIn.className = 'exercise-row__input';
    repsIn.placeholder = 'reps';
    repsIn.value = exercise.targetReps || '';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn--primary';
    addBtn.style.cssText = 'padding: var(--sp-2) var(--sp-3); font-size: 0.8125rem; min-height: 44px;';
    addBtn.textContent = '+ Set';

    addBtn.addEventListener('click', async () => {
      const weight = Number(weightIn.value) || 0;
      const reps = Number(repsIn.value) || 0;
      if (!weight && !reps) return;

      addBtn.disabled = true;
      addBtn.textContent = '...';

      const isPR = checkPR(exercise.name, weight, reps);
      const setNum = setList.children.length + 1;

      const entry = await addLiftEntry({
        sessionType: session.name,
        exercise: exercise.name,
        setNum,
        weight,
        reps
      });

      todayEntries.push(entry);
      allLiftData.push(entry);

      setList.appendChild(createSetRow(setNum, weight, reps, exercise.name));

      if (isPR) {
        showToast(`NEW PR: ${exercise.name} ${weight}lb x ${reps}`);
      }

      addBtn.disabled = false;
      addBtn.textContent = '+ Set';
    });

    addRow.appendChild(weightIn);
    addRow.appendChild(repsIn);
    addRow.appendChild(addBtn);
    card.appendChild(addRow);

    container.appendChild(card);
  });

  // Finish Session button
  const finishWrap = document.createElement('div');
  finishWrap.style.padding = 'var(--sp-4)';
  const finishBtn = document.createElement('button');
  finishBtn.type = 'button';
  finishBtn.className = 'btn btn--primary btn--full';
  finishBtn.style.padding = 'var(--sp-4)';
  finishBtn.textContent = 'Finish Session';
  finishBtn.addEventListener('click', () => {
    selectedSession = null;
    renderLiftsSubTab(container);
  });
  finishWrap.appendChild(finishBtn);
  container.appendChild(finishWrap);
}

function createSetRow(setNum, weight, reps, exerciseName) {
  const row = document.createElement('div');
  row.className = 'exercise-row';

  const numSpan = document.createElement('span');
  numSpan.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); width: 40px; flex-shrink: 0;';
  numSpan.textContent = `Set ${setNum}`;
  row.appendChild(numSpan);

  const labelSpan = document.createElement('span');
  labelSpan.className = 'exercise-row__label';
  labelSpan.textContent = `${weight}lb x ${reps}`;
  row.appendChild(labelSpan);

  const arrow = getProgressArrow(exerciseName, weight);
  const arrowSpan = document.createElement('span');
  arrowSpan.className = 'exercise-row__arrow';
  if (arrow.cls) arrowSpan.classList.add(arrow.cls);
  arrowSpan.textContent = arrow.icon;
  row.appendChild(arrowSpan);

  return row;
}

function getLastSessionData(exercise) {
  const today = todayId();
  let lastDate = null;
  const sets = [];
  for (let i = allLiftData.length - 1; i >= 0; i--) {
    const row = allLiftData[i];
    if (row.exercise !== exercise) continue;
    if (row.date === today) continue;
    if (!lastDate) lastDate = row.date;
    if (row.date === lastDate) {
      sets.unshift({ weight: row.weight || 0, reps: row.reps || 0 });
    } else if (lastDate) break;
  }
  return sets.length > 0 ? { date: lastDate, sets } : null;
}

function getPRData(exercise) {
  let best = null;
  let bestVol = 0;
  for (const row of allLiftData) {
    if (row.exercise !== exercise) continue;
    const w = row.weight || 0;
    const r = row.reps || 0;
    const vol = w * r;
    if (vol > bestVol) {
      bestVol = vol;
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
  if (!last || last.sets.length === 0) return { icon: '', cls: '' };
  const lastWeight = last.sets[last.sets.length - 1].weight;
  if (weight > lastWeight) return { icon: '↑', cls: 'exercise-row__arrow--up' };
  if (weight < lastWeight) return { icon: '↓', cls: 'exercise-row__arrow--down' };
  return { icon: '→', cls: 'exercise-row__arrow--same' };
}

function getOverallStats() {
  const sessions = new Set();
  const bestByEx = {};
  let prs = 0;
  for (const row of allLiftData) {
    if (row.date && row.sessionType) sessions.add(row.date + '_' + row.sessionType);
    const vol = (row.weight || 0) * (row.reps || 0);
    if (row.exercise && vol > 0) {
      if (!bestByEx[row.exercise] || vol > bestByEx[row.exercise]) {
        if (bestByEx[row.exercise]) prs++;
        bestByEx[row.exercise] = vol;
      }
    }
  }
  return { sessions: sessions.size, prs, totalSets: allLiftData.length };
}

function todayId() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '-');
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
