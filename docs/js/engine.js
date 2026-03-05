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
  PRAYERS, FARD_PRAYER_COLS, DL, CUT
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
 * Calculate streak from daily log data array
 * @param {Array<Array>} logData - rows from Daily Log (most recent last)
 * @returns {number} current streak
 */
export function calculateStreak(logData) {
  let streak = 0;

  for (let i = logData.length - 1; i >= 0; i--) {
    const row = logData[i];
    const completed = row[DL.COMPLETED - 1];

    if (completed === true || completed === 'TRUE') {
      streak++;

      // Check if previous day is consecutive
      if (i > 0) {
        const thisDate = parseSheetDate(row[DL.DATE - 1]);
        const prevDate = parseSheetDate(logData[i - 1][DL.DATE - 1]);
        if (thisDate && prevDate) {
          const diffDays = Math.round((thisDate - prevDate) / 86400000);
          if (diffDays !== 1) break;
        }
      }
    } else {
      break;
    }
  }

  return streak;
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
