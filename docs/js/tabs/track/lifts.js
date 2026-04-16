/**
 * track/lifts.js — Workout/lift tracker sub-tab
 * Configurable sessions, set logging, PR detection, progress arrows.
 */

import { addLiftEntry, getTodayLifts, getAllLifts } from '../../firebase.js';
import { getWorkoutSessions, getAbsExercises } from '../../user-config.js';
import { showToast } from '../../app.js';

let allLiftData = null;
let selectedSession = null;

export async function renderLiftsSubTab(container) {
  // Load all lift history (cached after first load)
  if (!allLiftData) {
    allLiftData = await getAllLifts();
  }

  const sessions = getWorkoutSessions();

  container.textContent = '';

  if (selectedSession) {
    renderSessionView(container);
  } else {
    renderSessionSelector(container);
  }
}

function renderSessionSelector(container) {
  // Session buttons
  const label = document.createElement('h3');
  label.className = 'section-label';
  label.textContent = 'Select Session';
  container.appendChild(label);

  const grid = document.createElement('div');
  grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3);';

  sessions.forEach(session => {
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
    count.textContent = `${(session.exercises || []).length} exercises`;
    card.appendChild(count);

    card.addEventListener('click', () => {
      selectedSession = session;
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

  const allData = allLiftData || [];
  const uniqueSessions = new Set(allData.map(l => `${l.date}-${l.sessionType}`)).size;
  const totalSets = allData.length;

  const stats = [
    { label: 'Total sessions', value: uniqueSessions },
    { label: 'Total sets', value: totalSets },
  ];

  stats.forEach(s => {
    const row = document.createElement('div');
    row.className = 'row row--between';
    row.style.padding = 'var(--sp-2) 0';
    const l = document.createElement('span');
    l.className = 'text-muted';
    l.style.fontSize = '0.875rem';
    l.textContent = s.label;
    row.appendChild(l);
    const v = document.createElement('span');
    v.className = 'data-value';
    v.textContent = s.value;
    row.appendChild(v);
    statsCard.appendChild(row);
  });

  container.appendChild(statsCard);
}

function renderSessionView(container) {
  // Back button
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'skill-detail__back';
  back.textContent = '← Sessions';
  back.addEventListener('click', () => {
    selectedSession = null;
    renderLiftsSubTab(container);
  });
  container.appendChild(back);

  const title = document.createElement('h2');
  title.textContent = selectedSession.name;
  title.style.marginBottom = 'var(--sp-4)';
  container.appendChild(title);

  // Get today's entries for this session
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = (allLiftData || []).filter(l =>
    l.date === todayStr && l.sessionType === selectedSession.name
  );

  // All exercises for this session + abs
  const exercises = [...(selectedSession.exercises || []), ...getAbsExercises()];

  exercises.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-3)';

    // Exercise name + PR
    const headerRow = document.createElement('div');
    headerRow.className = 'row row--between';
    headerRow.style.marginBottom = 'var(--sp-3)';

    const exName = document.createElement('div');
    exName.style.cssText = 'font-weight: 600; font-size: 0.9375rem;';
    exName.textContent = exercise.name;
    headerRow.appendChild(exName);

    // PR badge
    const pr = getPR(exercise.name);
    if (pr) {
      const prBadge = document.createElement('span');
      prBadge.style.cssText = 'font-size: 0.6875rem; color: var(--accent); font-weight: 600;';
      prBadge.textContent = `PR: ${pr.weight}×${pr.reps}`;
      headerRow.appendChild(prBadge);
    }

    card.appendChild(headerRow);

    // Last session reference
    const lastSets = getLastSessionSets(exercise.name, selectedSession.name);
    if (lastSets.length > 0) {
      const lastRef = document.createElement('div');
      lastRef.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: var(--sp-3);';
      lastRef.textContent = 'Last: ' + lastSets.map(s => `${s.weight}×${s.reps}`).join(', ');
      card.appendChild(lastRef);
    }

    // Today's logged sets
    const todaySets = todayEntries.filter(e => e.exercise === exercise.name);
    const setList = document.createElement('div');
    setList.id = `sets-${exercise.name.replace(/\W/g, '')}`;

    todaySets.forEach((s, i) => {
      const setRow = document.createElement('div');
      setRow.className = 'exercise-row';

      const setNum = document.createElement('span');
      setNum.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); width: 32px;';
      setNum.textContent = `Set ${i + 1}`;
      setRow.appendChild(setNum);

      const setLabel = document.createElement('span');
      setLabel.className = 'exercise-row__label';
      setLabel.textContent = `${s.weight} × ${s.reps}`;
      setRow.appendChild(setLabel);

      // Progress arrow vs last session
      const arrow = document.createElement('span');
      arrow.className = 'exercise-row__arrow';
      if (lastSets[i]) {
        if (s.weight > lastSets[i].weight) { arrow.className += ' exercise-row__arrow--up'; arrow.textContent = '↑'; }
        else if (s.weight < lastSets[i].weight) { arrow.className += ' exercise-row__arrow--down'; arrow.textContent = '↓'; }
        else { arrow.className += ' exercise-row__arrow--same'; arrow.textContent = '→'; }
      }
      setRow.appendChild(arrow);

      setList.appendChild(setRow);
    });

    card.appendChild(setList);

    // Add set form
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

      const setNum = todaySets.length + setList.children.length + 1;
      const entry = await addLiftEntry({
        sessionType: selectedSession.name,
        exercise: exercise.name,
        setNum,
        weight,
        reps
      });

      // Add to local data
      if (allLiftData) allLiftData.unshift(entry);

      // Check PR
      const currentPR = getPR(exercise.name);
      const volume = weight * reps;
      if (!currentPR || volume > currentPR.weight * currentPR.reps) {
        showToast(`PR! ${exercise.name}: ${weight}×${reps}`);
      }

      // Add set row to DOM
      const newRow = document.createElement('div');
      newRow.className = 'exercise-row';
      const num = document.createElement('span');
      num.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); width: 32px;';
      num.textContent = `Set ${setNum}`;
      newRow.appendChild(num);
      const label = document.createElement('span');
      label.className = 'exercise-row__label';
      label.textContent = `${weight} × ${reps}`;
      newRow.appendChild(label);
      setList.appendChild(newRow);

      addBtn.disabled = false;
      addBtn.textContent = '+ Set';
    });

    addRow.appendChild(weightIn);
    addRow.appendChild(repsIn);
    addRow.appendChild(addBtn);
    card.appendChild(addRow);

    container.appendChild(card);
  });

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}

function getPR(exerciseName) {
  if (!allLiftData) return null;
  let best = null;
  allLiftData.forEach(l => {
    if (l.exercise === exerciseName && l.weight && l.reps) {
      const vol = l.weight * l.reps;
      if (!best || vol > best.weight * best.reps) {
        best = { weight: l.weight, reps: l.reps };
      }
    }
  });
  return best;
}

function getLastSessionSets(exerciseName, sessionType) {
  if (!allLiftData) return [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Find most recent date for this session that isn't today
  const pastEntries = allLiftData.filter(l =>
    l.sessionType === sessionType && l.exercise === exerciseName && l.date !== todayStr
  );

  if (pastEntries.length === 0) return [];

  // Sort by date desc, get the most recent date
  pastEntries.sort((a, b) => b.date.localeCompare(a.date));
  const lastDate = pastEntries[0].date;

  return pastEntries
    .filter(l => l.date === lastDate)
    .sort((a, b) => (a.setNum || 0) - (b.setNum || 0));
}
