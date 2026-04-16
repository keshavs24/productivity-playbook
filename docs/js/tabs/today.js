/**
 * today.js — Merged Dashboard + Check-in tab
 * v2: Firebase backend, clean minimal design
 *
 * Sections:
 * 1. Level display + XP progress bar
 * 2. Wisdom quote
 * 3. Habits (toggleable pills)
 * 4. Attributes (segment bars)
 * 5. Activity heatmap (4 weeks)
 * 6. Quick inputs (MRR, weight, diet, win)
 * 7. Mark complete button
 */

import {
  getTodayLog, updateTodayLog, toggleHabit, setAttribute, getRecentLogs,
  getFlashcardStates, getTodayPrayers, getTodayNutrition, getTodayLifts, getAllLogs
} from '../firebase.js';
import {
  getLevelFromXP, getLevelTitle, getLevelProgress, calculateDailyXP,
  calculateStreak, getStreakMultiplier, prayerDocToArray, formatCurrency, daysUntil
} from '../engine.js';
import { getDueCards, getReviewStats } from '../spaced-repetition.js';
import { openFlashcardReview } from '../components/flashcard-review.js';
import { createProgressBar } from '../components/progress-bar.js';
import { createSegmentBar } from '../components/segment-bar.js';
import { createHeatmap } from '../components/heatmap.js';
import { HABITS, ATTRIBUTES, GOALS, CUT } from '../../config.js';
import { WISDOM_QUOTES } from '../wisdom.js';

// Debounce timer for XP recalculation
let xpDebounceTimer = null;

/**
 * Recalculate XP for today based on ALL data sources.
 * Called after any mutation (habit, attribute, MRR, weight, etc.)
 * Debounced to 500ms to batch rapid changes.
 */
function scheduleXPRecalc() {
  clearTimeout(xpDebounceTimer);
  xpDebounceTimer = setTimeout(async () => {
    try {
      const [todayLog, prayers, nutrition, lifts, allLogs] = await Promise.all([
        getTodayLog(),
        getTodayPrayers(),
        getTodayNutrition(),
        getTodayLifts(),
        getAllLogs()
      ]);

      const streak = calculateStreak(allLogs);
      const prayerArray = prayerDocToArray(prayers);

      const dayData = {
        habits: todayLog.habits || [],
        attrs: todayLog.attributes || [],
        mrr: todayLog.mrr || 0,
        weight: todayLog.weight || 0,
        win: todayLog.winOfDay || '',
        dietScore: todayLog.dietScore || 0,
        prayerData: prayerArray,
        hasLifts: lifts.length > 0,
        hasNutrition: nutrition.length > 0
      };

      const xpEarned = calculateDailyXP(dayData, streak);

      // Get yesterday's totalXp to compute cumulative
      const yesterdayLog = allLogs.length >= 2 ? allLogs[allLogs.length - 2] : null;
      const prevTotalXp = (yesterdayLog && todayLog.date !== yesterdayLog.date)
        ? (yesterdayLog.totalXp || 0)
        : (todayLog.totalXp - (todayLog.xpEarned || 0)) || 0;
      const totalXp = prevTotalXp + xpEarned;

      await updateTodayLog({ xpEarned, totalXp, streak });

      // Update level display if visible
      updateLevelDisplay(totalXp, streak);
    } catch (e) {
      console.error('XP recalc failed:', e);
    }
  }, 500);
}

/**
 * Update the level display on screen without full re-render.
 */
function updateLevelDisplay(totalXp, streak) {
  const levelNum = document.querySelector('.level-display__number');
  const levelTitle = document.querySelector('.level-display__title');
  const xpText = document.querySelector('.level-display__xp');
  const streakEl = document.querySelector('.streak-display');

  if (levelNum) {
    const level = getLevelFromXP(totalXp);
    levelNum.textContent = level;
    if (levelTitle) levelTitle.textContent = getLevelTitle(level);
    if (xpText) {
      const mult = getStreakMultiplier(streak);
      xpText.textContent = `${totalXp.toLocaleString()} XP${mult > 1 ? ` · ${mult}x` : ''}`;
    }
  }
  if (streakEl && streak !== undefined) {
    streakEl.textContent = streak > 0 ? `${streak}-day streak` : '';
  }
}

export async function renderToday(isFirstLoad) {
  const panel = document.getElementById('tab-today');
  if (!panel) return;

  // Fetch ALL data sources in parallel
  const [todayLog, recentLogs, allLogs, prayers, nutrition, lifts] = await Promise.all([
    getTodayLog(),
    getRecentLogs(28),
    getAllLogs(),
    getTodayPrayers().catch(() => null),
    getTodayNutrition().catch(() => []),
    getTodayLifts().catch(() => [])
  ]);

  // Load flashcards for daily review
  let flashcardsData = null;
  let flashcardStates = {};
  try {
    const [fcResp, fcStates] = await Promise.all([
      fetch('data/flashcards.json').then(r => r.json()),
      getFlashcardStates()
    ]);
    flashcardsData = fcResp;
    flashcardStates = fcStates;
  } catch (e) { /* ok */ }

  // Calculate streak from all logs
  const streak = calculateStreak(allLogs);

  renderTodayContent(panel, todayLog, recentLogs, streak, prayers, nutrition, lifts, flashcardsData, flashcardStates);
}

function renderTodayContent(panel, todayLog, recentLogs, streak, prayers, nutrition, lifts, flashcardsData, flashcardStates) {
  const totalXP = todayLog.totalXp || 0;
  const level = getLevelFromXP(totalXP);
  const title = getLevelTitle(level);
  const progress = getLevelProgress(totalXP, level);

  panel.textContent = '';

  // 1. Level display
  const levelSection = document.createElement('div');
  levelSection.className = 'level-display';

  const levelNum = document.createElement('div');
  levelNum.className = 'level-display__number';
  levelNum.textContent = level;
  levelSection.appendChild(levelNum);

  const levelTitle = document.createElement('div');
  levelTitle.className = 'level-display__title';
  levelTitle.textContent = title;
  levelSection.appendChild(levelTitle);

  const mult = getStreakMultiplier(streak);
  const xpText = document.createElement('div');
  xpText.className = 'level-display__xp';
  xpText.textContent = `${totalXP.toLocaleString()} XP${mult > 1 ? ` · ${mult}x streak` : ''}`;
  levelSection.appendChild(xpText);

  // Streak display
  if (streak > 0) {
    const streakEl = document.createElement('div');
    streakEl.className = 'streak-display';
    streakEl.style.cssText = 'font-size: 0.875rem; color: var(--accent); font-weight: 500; margin-top: var(--sp-1);';
    streakEl.textContent = `${streak}-day streak`;
    levelSection.appendChild(streakEl);
  }

  const progressWrapper = document.createElement('div');
  progressWrapper.style.cssText = 'max-width: 200px; margin: 0 auto;';
  progressWrapper.insertAdjacentHTML('beforeend', createProgressBar(progress * 100));
  levelSection.appendChild(progressWrapper);

  panel.appendChild(levelSection);

  // 2. Wisdom
  const wisdom = getRandomWisdom();
  if (wisdom) {
    const wisdomCard = document.createElement('div');
    wisdomCard.className = 'wisdom-card';
    const wText = document.createElement('div');
    wText.className = 'wisdom-card__text';
    wText.textContent = wisdom.text;
    wisdomCard.appendChild(wText);
    const wSource = document.createElement('div');
    wSource.className = 'wisdom-card__source';
    wSource.textContent = wisdom.source;
    wisdomCard.appendChild(wSource);
    panel.appendChild(wisdomCard);
  }

  // 2.5 Daily flashcard review
  if (flashcardsData && Object.keys(flashcardStates).length > 0) {
    const dueCards = getDueCards(flashcardStates, flashcardsData);
    if (dueCards.length > 0) {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'card card--interactive';
      reviewCard.style.cssText = 'border-color: var(--accent-border); cursor: pointer; margin-top: var(--sp-4);';

      const reviewRow = document.createElement('div');
      reviewRow.className = 'row row--between';
      const reviewTitle = document.createElement('div');
      reviewTitle.style.cssText = 'font-weight: 600;';
      reviewTitle.textContent = `${dueCards.length} flashcards due`;
      reviewRow.appendChild(reviewTitle);
      const reviewAction = document.createElement('div');
      reviewAction.style.cssText = 'color: var(--accent); font-weight: 500; font-size: 0.875rem;';
      reviewAction.textContent = 'Review →';
      reviewRow.appendChild(reviewAction);
      reviewCard.appendChild(reviewRow);

      reviewCard.addEventListener('click', () => {
        openFlashcardReview(
          dueCards.slice(0, 20),
          flashcardStates,
          async (cardId, newState) => {
            flashcardStates[cardId] = newState;
            const { updateFlashcardState } = await import('../firebase.js');
            await updateFlashcardState(cardId, newState);
          },
          () => { /* refresh will happen naturally */ }
        );
      });

      panel.appendChild(reviewCard);
    }
  }

  // 3. Habits
  const habitsLabel = document.createElement('h3');
  habitsLabel.className = 'section-label';
  habitsLabel.textContent = 'Habits';
  panel.appendChild(habitsLabel);

  const habitsGrid = document.createElement('div');
  habitsGrid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';

  const habits = todayLog.habits || [];
  HABITS.forEach((h, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'habit-toggle';
    if (habits[i]) btn.classList.add('habit-toggle--active');
    btn.setAttribute('aria-pressed', habits[i] ? 'true' : 'false');
    btn.textContent = h;
    btn.addEventListener('click', async () => {
      const newState = !btn.classList.contains('habit-toggle--active');
      btn.classList.toggle('habit-toggle--active', newState);
      btn.setAttribute('aria-pressed', newState ? 'true' : 'false');
      await toggleHabit(i, newState);
      scheduleXPRecalc();
    });
    habitsGrid.appendChild(btn);
  });
  panel.appendChild(habitsGrid);

  // 4. Attributes
  const attrsLabel = document.createElement('h3');
  attrsLabel.className = 'section-label';
  attrsLabel.textContent = 'Character';
  panel.appendChild(attrsLabel);

  const attrsContainer = document.createElement('div');
  attrsContainer.className = 'stack stack--4';

  const attrs = todayLog.attributes || [];
  ATTRIBUTES.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'row row--between';
    const label = document.createElement('span');
    label.className = 'text-muted';
    label.style.cssText = 'font-size: 0.8125rem; width: 120px; flex-shrink: 0;';
    label.textContent = a;
    row.appendChild(label);
    const bar = createSegmentBar(a, attrs[i] || 0, async (val) => {
      await setAttribute(i, val);
      scheduleXPRecalc();
    });
    bar.style.flex = '1';
    row.appendChild(bar);
    attrsContainer.appendChild(row);
  });
  panel.appendChild(attrsContainer);

  // 5. Heatmap
  const heatLabel = document.createElement('h3');
  heatLabel.className = 'section-label';
  heatLabel.textContent = 'Activity';
  panel.appendChild(heatLabel);

  const heatData = buildHeatmapData(recentLogs);
  const heatDiv = document.createElement('div');
  heatDiv.insertAdjacentHTML('beforeend', createHeatmap(heatData, 4));
  panel.appendChild(heatDiv);

  // 6. Quick inputs
  const quickLabel = document.createElement('h3');
  quickLabel.className = 'section-label';
  quickLabel.textContent = 'Log';
  panel.appendChild(quickLabel);

  const quickCard = document.createElement('div');
  quickCard.className = 'card stack stack--4';

  quickCard.appendChild(createInputRow('MRR ($)', 'number', todayLog.mrr || '',
    async (val) => { await updateTodayLog({ mrr: Number(val) || 0 }); scheduleXPRecalc(); }
  ));

  quickCard.appendChild(createInputRow('Weight (lbs)', 'number', todayLog.weight || '',
    async (val) => { await updateTodayLog({ weight: Number(val) || 0 }); scheduleXPRecalc(); }
  ));

  // Diet score
  const dietRow = document.createElement('div');
  dietRow.className = 'row row--between';
  const dietLabel = document.createElement('span');
  dietLabel.className = 'text-muted';
  dietLabel.style.cssText = 'font-size: 0.8125rem; width: 120px; flex-shrink: 0;';
  dietLabel.textContent = 'Diet Score';
  dietRow.appendChild(dietLabel);
  const dietBar = createSegmentBar('Diet', todayLog.dietScore || 0, async (val) => {
    await updateTodayLog({ dietScore: val });
    scheduleXPRecalc();
  });
  dietBar.style.flex = '1';
  dietRow.appendChild(dietBar);
  quickCard.appendChild(dietRow);

  // Win of the day
  const winRow = document.createElement('div');
  const winLabel = document.createElement('label');
  winLabel.className = 'text-muted';
  winLabel.style.fontSize = '0.8125rem';
  winLabel.textContent = 'Win of the day';
  winRow.appendChild(winLabel);
  const winInput = document.createElement('textarea');
  winInput.className = 'textarea';
  winInput.rows = 2;
  winInput.placeholder = 'What was your biggest win today?';
  winInput.value = todayLog.winOfDay || '';
  winInput.addEventListener('change', async () => {
    await updateTodayLog({ winOfDay: winInput.value });
    scheduleXPRecalc();
  });
  winRow.appendChild(winInput);
  quickCard.appendChild(winRow);

  panel.appendChild(quickCard);

  // 7. Mark complete
  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'btn btn--primary btn--full';
  completeBtn.style.marginTop = 'var(--sp-6)';
  const isCompleted = todayLog.completed;
  completeBtn.textContent = isCompleted ? 'Day Completed' : 'Mark Day Complete';
  if (isCompleted) completeBtn.style.opacity = '0.5';
  completeBtn.addEventListener('click', async () => {
    await updateTodayLog({ completed: true });
    completeBtn.textContent = 'Day Completed';
    completeBtn.style.opacity = '0.5';
  });
  panel.appendChild(completeBtn);

  // Bottom spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  panel.appendChild(spacer);
}

function createInputRow(label, type, value, onChange) {
  const row = document.createElement('div');
  row.className = 'row row--between';
  const lbl = document.createElement('span');
  lbl.className = 'text-muted';
  lbl.style.fontSize = '0.8125rem';
  lbl.textContent = label;
  row.appendChild(lbl);
  const inp = document.createElement('input');
  inp.type = type;
  inp.className = 'input';
  inp.style.cssText = 'width: 120px; text-align: right;';
  inp.value = value;
  inp.addEventListener('change', () => onChange(inp.value));
  row.appendChild(inp);
  return row;
}

function buildHeatmapData(logs) {
  const data = new Map();
  logs.forEach(log => {
    const habitsDone = (log.habits || []).filter(Boolean).length;
    let score = 0;
    if (habitsDone >= 1) score = 1;
    if (habitsDone >= 3) score = 2;
    if (habitsDone >= 5) score = 3;
    if (habitsDone >= 7) score = 4;
    data.set(log.date, { score });
  });
  return data;
}

function getRandomWisdom() {
  if (!WISDOM_QUOTES || WISDOM_QUOTES.length === 0) return null;
  const idx = Math.floor(Math.random() * WISDOM_QUOTES.length);
  return WISDOM_QUOTES[idx];
}
