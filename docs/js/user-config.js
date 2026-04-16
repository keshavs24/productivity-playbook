/**
 * user-config.js — Centralized user configuration loader
 *
 * Loads user preferences from Firebase profile, falls back to config.js defaults.
 * All tabs import from here instead of directly from config.js.
 * Cache is refreshed after settings changes.
 */

import { getProfile } from './firebase.js';
import { HABITS, ATTRIBUTES, WORKOUT_SPLIT, ABS_EXERCISES, CUT, GOALS } from '../config.js';

let cached = null;
let loaded = false;

// Default prayers (full traditional set)
const DEFAULT_PRAYERS = [
  { key: 'fajrSunnah', name: 'Fajr Sunnah', time: 'Fajr', type: 'sunnah', rakahs: 2 },
  { key: 'fajrFard', name: 'Fajr Fard', time: 'Fajr', type: 'fard', rakahs: 2 },
  { key: 'dhuhrSunnahBefore', name: 'Dhuhr Sunnah (Before)', time: 'Dhuhr', type: 'sunnah', rakahs: 4 },
  { key: 'dhuhrFard', name: 'Dhuhr Fard', time: 'Dhuhr', type: 'fard', rakahs: 4 },
  { key: 'dhuhrSunnahAfter', name: 'Dhuhr Sunnah (After)', time: 'Dhuhr', type: 'sunnah', rakahs: 2 },
  { key: 'asrFard', name: 'Asr Fard', time: 'Asr', type: 'fard', rakahs: 4 },
  { key: 'maghribFard', name: 'Maghrib Fard', time: 'Maghrib', type: 'fard', rakahs: 3 },
  { key: 'maghribSunnah', name: 'Maghrib Sunnah', time: 'Maghrib', type: 'sunnah', rakahs: 2 },
  { key: 'ishaFard', name: 'Isha Fard', time: 'Isha', type: 'fard', rakahs: 4 },
  { key: 'ishaSunnah', name: 'Isha Sunnah', time: 'Isha', type: 'sunnah', rakahs: 2 },
  { key: 'witr', name: 'Witr', time: 'Isha', type: 'wajib', rakahs: 3 },
];

const DEFAULT_MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const DEFAULT_NUTRITION_TARGETS = {
  dailyCalories: CUT.DAILY_CALORIES,
  proteinG: CUT.PROTEIN_G,
  carbsG: CUT.CARBS_G,
  fatG: CUT.FAT_G
};

const DEFAULT_BODY_TARGETS = {
  startWeight: CUT.START_WEIGHT,
  targetWeight: CUT.TARGET_WEIGHT,
  startBF: CUT.START_BF,
  targetBF: CUT.TARGET_BF
};

/**
 * Load user config from Firebase. Call once at app startup.
 * Caches the result — call refreshConfig() after settings changes.
 */
export async function loadUserConfig() {
  try {
    cached = await getProfile() || {};
  } catch (e) {
    console.warn('Could not load profile, using defaults:', e);
    cached = {};
  }
  loaded = true;
  return cached;
}

/**
 * Refresh config after settings change.
 */
export async function refreshConfig() {
  return loadUserConfig();
}

/**
 * Check if config has been loaded.
 */
export function isConfigLoaded() {
  return loaded;
}

// ============================================================
// GETTERS — each returns user config or falls back to defaults
// ============================================================

export function getHabits() {
  return cached?.habits || HABITS;
}

export function getAttributes() {
  return cached?.attributes || ATTRIBUTES;
}

export function getMealTypes() {
  return cached?.mealTypes || DEFAULT_MEAL_TYPES;
}

export function getPrayers() {
  return cached?.prayers || DEFAULT_PRAYERS;
}

export function getWorkoutSessions() {
  return cached?.workoutSessions || WORKOUT_SPLIT;
}

export function getAbsExercises() {
  return cached?.absExercises || ABS_EXERCISES;
}

export function getNutritionTargets() {
  return cached?.nutritionTargets || DEFAULT_NUTRITION_TARGETS;
}

export function getBodyTargets() {
  return cached?.bodyTargets || DEFAULT_BODY_TARGETS;
}

export function getGoals() {
  return cached?.goals || [];
}

/**
 * Get prayer keys for Firebase document fields.
 * Dynamically derived from the prayer list.
 */
export function getPrayerKeys() {
  return getPrayers().map(p => p.key);
}

/**
 * Group prayers by time (Fajr, Dhuhr, etc.)
 */
export function getPrayerGroups() {
  const prayers = getPrayers();
  const groups = [];
  const seen = new Set();

  prayers.forEach(p => {
    if (!seen.has(p.time)) {
      seen.add(p.time);
      groups.push({
        time: p.time,
        prayers: prayers.filter(pr => pr.time === p.time)
      });
    }
  });

  return groups;
}

/**
 * Get the raw cached profile (for settings UI).
 */
export function getRawProfile() {
  return cached || {};
}
