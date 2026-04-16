/**
 * config.js — User configuration + all game constants
 * v2: Firebase backend (replaces Google Sheets)
 */

// ============================================================
// FIREBASE CONFIG — Paste your config from Firebase Console
// ============================================================
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBCF_9g2qwTPUjsmnvXc9b4jzHIH-S39fM',
  authDomain: 'productivity-playbook-30372.firebaseapp.com',
  projectId: 'productivity-playbook-30372',
  storageBucket: 'productivity-playbook-30372.firebasestorage.app',
  messagingSenderId: '175998865124',
  appId: '1:175998865124:web:377f8d945e924cec3c26f1'
};

// ============================================================
// AUTH CONFIG
// ============================================================
export const AUTH_EMAIL = '';    // Your email for sign-in
export const AUTH_PASSWORD = ''; // Your password for sign-in

// ============================================================
// HABITS
// ============================================================
export const HABITS = [
  'Wake Before Fajr',
  'All 5 Prayers',
  'Workout',
  'Deep Work 4h+',
  'Ship Something',
  'Quran Reading',
  'Read 30 Min'
];

// ============================================================
// ATTRIBUTES
// ============================================================
export const ATTRIBUTES = [
  'Discipline',
  'Focus',
  'Confidence',
  'Deen',
  'Mental Toughness',
  'Reliability'
];

// ============================================================
// XP VALUES
// ============================================================
export const XP_PER_HABIT = 10;
export const PERFECT_DAY_BONUS = 30;
export const XP_PER_ATTRIBUTE = 3;
export const ALL_ATTRIBUTES_BONUS = 12;
export const MRR_LOG_XP = 5;
export const WEIGHT_LOG_XP = 5;
export const WIN_OF_DAY_XP = 10;
export const DIET_PERFECT_XP = 15;
export const DIET_LOG_XP = 5;
export const BODY_COMP_LOG_XP = 5;
export const PRAYER_XP_PER_FARD = 5;
export const PRAYER_XP_PER_SUNNAH = 2;
export const PRAYER_ALL_FARD_BONUS = 15;
export const PRAYER_ALL_PRAYERS_BONUS = 25;
export const NUTRITION_LOG_XP = 5;
export const LIFT_LOG_XP = 10;
export const LIFT_PR_XP = 20;
export const MAX_DAILY_XP_BASE = 250;

// ============================================================
// STREAK CONFIG
// ============================================================
export const STREAK_MULTIPLIERS = [
  { minDays: 1,  maxDays: 6,   multiplier: 1.0 },
  { minDays: 7,  maxDays: 13,  multiplier: 1.2 },
  { minDays: 14, maxDays: 20,  multiplier: 1.4 },
  { minDays: 21, maxDays: 29,  multiplier: 1.6 },
  { minDays: 30, maxDays: 59,  multiplier: 1.8 },
  { minDays: 60, maxDays: 89,  multiplier: 2.0 },
  { minDays: 90, maxDays: 9999, multiplier: 2.5 }
];

export const PHOENIX_MULTIPLIER = 2.0;
export const PHOENIX_DURATION_DAYS = 3;
export const PHOENIX_TRIGGER_MISSED_DAYS = 3;

// ============================================================
// LEVELS
// ============================================================
export const MAX_LEVEL = 50;

export const LEVEL_TITLES = {
  1:  'Tawbah',
  2:  'Tawbah',
  3:  'Niyyah',
  4:  'Niyyah',
  5:  'Mureed',
  6:  'Mureed',
  7:  'Salik',
  8:  'Salik',
  9:  'Salik',
  10: 'Mujtahid',
  11: 'Mujtahid',
  12: 'Mujtahid',
  13: 'Mujtahid',
  14: 'Mujtahid',
  15: 'Sabir',
  16: 'Sabir',
  17: 'Sabir',
  18: 'Sabir',
  19: 'Sabir',
  20: 'Mutqin',
  21: 'Mutqin',
  22: 'Mutqin',
  23: 'Mutqin',
  24: 'Mutqin',
  25: 'Mujahid',
  26: 'Mujahid',
  27: 'Mujahid',
  28: 'Mujahid',
  29: 'Mujahid',
  30: 'Istiqamah',
  31: 'Istiqamah',
  32: 'Istiqamah',
  33: 'Istiqamah',
  34: 'Istiqamah',
  35: 'Istiqamah',
  36: 'Istiqamah',
  37: 'Istiqamah',
  38: 'Istiqamah',
  39: 'Istiqamah',
  40: 'Muhsin',
  41: 'Muhsin',
  42: 'Muhsin',
  43: 'Muhsin',
  44: 'Muhsin',
  45: 'Muhsin',
  46: 'Muhsin',
  47: 'Muhsin',
  48: 'Muhsin',
  49: 'Muhsin',
  50: 'Khalifah'
};

// ============================================================
// GOALS
// ============================================================
export const GOALS = {
  mrr30k: { target: 30000, deadline: '2026-04-01', label: '$30k MRR' },
  mrr100k: { target: 100000, deadline: '2026-06-01', label: '$100k MRR' },
  sixPack: { targetBodyFat: 12, label: '6-Pack' }
};

// ============================================================
// CUT PLAN
// ============================================================
export const CUT = {
  START_WEIGHT: 173.2,
  START_BF: 18.6,
  TARGET_BF: 12,
  TARGET_WEIGHT: 160,
  TDEE: 2866,
  DAILY_CALORIES: 2350,
  PROTEIN_G: 190,
  FAT_G: 80,
  CARBS_G: 100,
  RATE_PER_WEEK: 1.0
};

// ============================================================
// LEGACY SHEET CONSTANTS — REMOVED (now using Firebase)
// ============================================================

// ============================================================
// PRAYERS
// ============================================================
export const PRAYERS = [
  { name: 'Fajr Sunnah',        col: 2,  type: 'sunnah', time: 'Fajr',    rakahs: 2 },
  { name: 'Fajr Fard',          col: 3,  type: 'fard',   time: 'Fajr',    rakahs: 2 },
  { name: 'Dhuhr Sunnah Before', col: 4,  type: 'sunnah', time: 'Dhuhr',   rakahs: 4 },
  { name: 'Dhuhr Fard',         col: 5,  type: 'fard',   time: 'Dhuhr',   rakahs: 4 },
  { name: 'Dhuhr Sunnah After',  col: 6,  type: 'sunnah', time: 'Dhuhr',   rakahs: 2 },
  { name: 'Asr Fard',           col: 7,  type: 'fard',   time: 'Asr',     rakahs: 4 },
  { name: 'Maghrib Fard',       col: 8,  type: 'fard',   time: 'Maghrib', rakahs: 3 },
  { name: 'Maghrib Sunnah',     col: 9,  type: 'sunnah', time: 'Maghrib', rakahs: 2 },
  { name: 'Isha Fard',          col: 10, type: 'fard',   time: 'Isha',    rakahs: 4 },
  { name: 'Isha Sunnah',        col: 11, type: 'sunnah', time: 'Isha',    rakahs: 2 },
  { name: 'Witr',               col: 12, type: 'wajib',  time: 'Isha',    rakahs: 3 }
];

export const FARD_PRAYER_COLS = [3, 5, 7, 8, 10];

// ============================================================
// WORKOUT SPLIT
// ============================================================
export const WORKOUT_SPLIT = [
  {
    name: 'Chest + Back + Abs',
    exercises: [
      { name: 'Flat DB Press',     targetWeight: 80,  targetReps: 8, sets: 2 },
      { name: 'Incline DB Press',  targetWeight: 60,  targetReps: 8, sets: 3 },
      { name: 'Pec Fly (Cable)',   targetWeight: 130, targetReps: 8, sets: 4, notes: 'Last set drop' },
      { name: 'Lat Pulldown',      targetWeight: 0,   targetReps: 10, sets: 3 },
      { name: 'Cable Row',         targetWeight: 0,   targetReps: 10, sets: 3 },
      { name: 'Barbell Row',       targetWeight: 0,   targetReps: 8, sets: 3 }
    ]
  },
  {
    name: 'Shoulders + Arms + Abs',
    exercises: [
      { name: 'OHP (DB or BB)',    targetWeight: 0,  targetReps: 8, sets: 3 },
      { name: 'Lateral Raises',    targetWeight: 0,  targetReps: 12, sets: 3 },
      { name: 'Face Pulls',        targetWeight: 0,  targetReps: 15, sets: 3 },
      { name: 'Barbell Curls',     targetWeight: 0,  targetReps: 10, sets: 3 },
      { name: 'Tricep Pushdowns',  targetWeight: 0,  targetReps: 12, sets: 3 },
      { name: 'Hammer Curls',      targetWeight: 0,  targetReps: 10, sets: 3 },
      { name: 'Skull Crushers',    targetWeight: 0,  targetReps: 10, sets: 3 }
    ]
  },
  {
    name: 'Legs + Abs',
    exercises: [
      { name: 'Squat',             targetWeight: 0,  targetReps: 8, sets: 3 },
      { name: 'Leg Press',         targetWeight: 0,  targetReps: 10, sets: 3 },
      { name: 'RDL',               targetWeight: 0,  targetReps: 8, sets: 3 },
      { name: 'Leg Curl',          targetWeight: 0,  targetReps: 10, sets: 3 },
      { name: 'Leg Extension',     targetWeight: 0,  targetReps: 10, sets: 3 },
      { name: 'Calf Raises',       targetWeight: 0,  targetReps: 15, sets: 3 }
    ]
  },
  {
    name: 'Cardio + Abs',
    exercises: []
  }
];

export const ABS_EXERCISES = [
  { name: 'Plate-Loaded Ab Crunch', targetWeight: 0, targetReps: 15, sets: 3 },
  { name: 'Hanging Leg Raises',     targetWeight: 0, targetReps: 12, sets: 3 }
];
