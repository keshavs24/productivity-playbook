/**
 * engine.js — Game logic: XP calculation, streaks, levels, achievements
 * Ported from Apps Script (Config.js + DailyLog.js) to operate on plain objects
 */

import {
  HABITS, ATTRIBUTES, XP_PER_HABIT, PERFECT_DAY_BONUS, XP_PER_ATTRIBUTE,
  ALL_ATTRIBUTES_BONUS, MRR_LOG_XP, WEIGHT_LOG_XP, WIN_OF_DAY_XP,
  DIET_PERFECT_XP, DIET_LOG_XP, PRAYER_XP_PER_FARD, PRAYER_XP_PER_SUNNAH,
  PRAYER_ALL_FARD_BONUS, PRAYER_ALL_PRAYERS_BONUS, NUTRITION_LOG_XP,
  LIFT_LOG_XP, MAX_LEVEL, LEVEL_TITLES, STREAK_MULTIPLIERS,
  PRAYERS, CUT
} from '../config.js';

/**
 * Get XP threshold for a level
 */
export function getLevelXP(level) {
  return Math.round(100 * Math.pow(level, 1.5));
}

/**
 * Get title for a level
 */
export function getLevelTitle(level) {
  if (level >= 50) return LEVEL_TITLES[50];
  return LEVEL_TITLES[level] || 'Tawbah';
}

/**
 * Get level from total XP
 */
export function getLevelFromXP(totalXP) {
  for (let lvl = MAX_LEVEL; lvl >= 1; lvl--) {
    if (totalXP >= getLevelXP(lvl)) return lvl;
  }
  return 1;
}

/**
 * Get streak multiplier
 */
export function getStreakMultiplier(streakDays) {
  for (let i = STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (streakDays >= STREAK_MULTIPLIERS[i].minDays) {
      return STREAK_MULTIPLIERS[i].multiplier;
    }
  }
  return 1.0;
}

/**
 * Calculate XP for a single day from raw data
 * @param {object} day - { habits: bool[], attrs: number[], mrr, weight, win, dietScore, prayerData, hasLifts, hasNutrition }
 * @param {number} streak - current streak count
 * @returns {number} XP earned
 */
export function calculateDailyXP(day, streak = 0) {
  let xp = 0;

  // Habit XP
  const habitsCompleted = (day.habits || []).filter(Boolean).length;
  xp += habitsCompleted * XP_PER_HABIT;

  // Perfect day bonus
  if (habitsCompleted === HABITS.length) {
    xp += PERFECT_DAY_BONUS;
  }

  // Attribute XP
  const attrsRated = (day.attrs || []).filter(v => v >= 1 && v <= 5).length;
  xp += attrsRated * XP_PER_ATTRIBUTE;

  // All attributes bonus
  if (attrsRated === ATTRIBUTES.length) {
    xp += ALL_ATTRIBUTES_BONUS;
  }

  // MRR logging
  if (day.mrr && day.mrr > 0) xp += MRR_LOG_XP;

  // Weight logging
  if (day.weight && day.weight > 0) xp += WEIGHT_LOG_XP;

  // Win of the day
  if (day.win && String(day.win).trim().length > 0) xp += WIN_OF_DAY_XP;

  // Diet
  if (day.dietScore && day.dietScore >= 1) {
    xp += DIET_LOG_XP;
    if (day.dietScore === 5) xp += DIET_PERFECT_XP;
  }

  // Prayer XP
  if (day.prayerData) {
    const pd = day.prayerData;
    let fardCount = 0;
    let sunnahCount = 0;

    for (const prayer of PRAYERS) {
      const colIdx = prayer.col - 2; // convert to 0-indexed within prayer data
      if (pd[colIdx] === true || pd[colIdx] === 'TRUE') {
        if (prayer.type === 'fard') fardCount++;
        else sunnahCount++;
      }
    }

    xp += fardCount * PRAYER_XP_PER_FARD;
    xp += sunnahCount * PRAYER_XP_PER_SUNNAH;
    if (fardCount === 5) xp += PRAYER_ALL_FARD_BONUS;
    if (fardCount + sunnahCount === PRAYERS.length) xp += PRAYER_ALL_PRAYERS_BONUS;
  }

  // Lift XP
  if (day.hasLifts) xp += LIFT_LOG_XP;

  // Nutrition XP
  if (day.hasNutrition) xp += NUTRITION_LOG_XP;

  // Apply streak multiplier
  const multiplier = getStreakMultiplier(streak);
  xp = Math.round(xp * multiplier);

  return xp;
}

/**
 * Calculate streak from Firestore daily log documents.
 * @param {Array<{date: string, completed: boolean}>} logs - sorted ascending by date
 * @returns {number} current streak
 */
export function calculateStreak(logs) {
  if (!logs || logs.length === 0) return 0;

  let streak = 0;

  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    if (!log.completed) break;

    streak++;

    // Check consecutive day gap
    if (i > 0) {
      const thisDate = new Date(log.date);
      const prevDate = new Date(logs[i - 1].date);
      const diffDays = Math.round((thisDate - prevDate) / 86400000);
      if (diffDays !== 1) break;
    }
  }

  return streak;
}

/**
 * Convert a Firestore prayer document to the array format calculateDailyXP expects.
 * Maps the named prayer fields to positional indices matching PRAYERS config.
 * @param {object} prayerDoc - Firestore prayer document
 * @returns {Array<boolean>} prayer data array (index = prayer.col - 2)
 */
export function prayerDocToArray(prayerDoc) {
  if (!prayerDoc) return null;

  // Map prayer field names to their column positions
  const fieldMap = {
    fajrSunnah: 0,       // col 2 → index 0
    fajrFard: 1,         // col 3 → index 1
    dhuhrSunnahBefore: 2,// col 4 → index 2
    dhuhrFard: 3,        // col 5 → index 3
    dhuhrSunnahAfter: 4, // col 6 → index 4
    asrFard: 5,          // col 7 → index 5
    maghribFard: 6,      // col 8 → index 6
    maghribSunnah: 7,    // col 9 → index 7
    ishaFard: 8,         // col 10 → index 8
    ishaSunnah: 9,       // col 11 → index 9
    witr: 10             // col 12 → index 10
  };

  const arr = new Array(11).fill(false);
  for (const [field, idx] of Object.entries(fieldMap)) {
    arr[idx] = !!prayerDoc[field];
  }
  return arr;
}

/**
 * Parse a date from sheet data (could be string or Date)
 */
export function parseSheetDate(val) {
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

/**
 * Get today as YYYY-MM-DD string
 */
export function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/**
 * Check if a date string/Date is today
 */
export function isToday(date) {
  const d = parseSheetDate(date);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

/**
 * Format number as currency
 */
/**
 * Calculate monthly consistency percentage.
 * More forgiving than streaks — shows % of days active this month.
 * @param {Array} logs - recent logs with { date, completed }
 * @returns {{ activeDays: number, totalDays: number, percentage: number }}
 */
export function getMonthlyConsistency(logs) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const today = new Date(year, month, now.getDate());
  const totalDays = now.getDate(); // days elapsed this month

  const activeDays = logs.filter(log => {
    const d = new Date(log.date);
    return d >= firstOfMonth && d <= today && log.completed;
  }).length;

  return {
    activeDays,
    totalDays,
    percentage: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0
  };
}

/**
 * Calculate adaptive task value (Habitica-inspired).
 * Tasks done consistently give less XP. Missed tasks give more.
 * @param {number} currentValue - current task value (starts at 0)
 * @param {boolean} completed - was the task done today?
 * @returns {{ newValue: number, xpMultiplier: number }}
 */
export function adaptiveTaskValue(currentValue = 0, completed = true) {
  let newValue = currentValue;

  if (completed) {
    // Completing moves toward blue (high value = easy = less XP)
    newValue = Math.min(10, currentValue + 1);
  } else {
    // Missing moves toward red (low value = urgent = more XP)
    newValue = Math.max(-5, currentValue - 1.5);
  }

  // XP multiplier: red tasks (negative value) give more XP
  // blue tasks (high value) give less XP
  // Formula: 1.0 at value 0, 0.5 at value 10, 2.0 at value -5
  const xpMultiplier = Math.max(0.3, 1.0 - (currentValue * 0.07));

  return { newValue, xpMultiplier };
}

export function formatCurrency(num) {
  if (!num) return '$0';
  return '$' + Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Days until a target date
 */
export function daysUntil(targetDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

/**
 * XP progress within current level (0-1)
 */
export function getLevelProgress(totalXP) {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = getLevelXP(level);
  const nextLevelXP = getLevelXP(Math.min(level + 1, MAX_LEVEL));
  if (nextLevelXP === currentLevelXP) return 1;
  return (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP);
}
