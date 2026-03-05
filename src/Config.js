/**
 * Config.js — All tunable constants for the Productivity Playbook
 */

// ============================================================
// HABITS
// ============================================================
var HABITS = [
  'Wake Before Fajr',
  'All 5 Prayers',
  'Workout',
  'Deep Work 4h+',
  'Ship Something',
  'Quran Reading',
  'Read 30 Min'
];

// ============================================================
// ATTRIBUTES (daily 1-5 self-rating)
// ============================================================
var ATTRIBUTES = [
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
var XP_PER_HABIT = 10;
var PERFECT_DAY_BONUS = 30;          // All 7 habits checked
var XP_PER_ATTRIBUTE = 3;
var ALL_ATTRIBUTES_BONUS = 12;       // All 6 attributes rated
var MRR_LOG_XP = 5;
var WEIGHT_LOG_XP = 5;
var WIN_OF_DAY_XP = 10;
var DIET_PERFECT_XP = 15;            // Diet score of 5
var DIET_LOG_XP = 5;                 // Any diet score logged
var BODY_COMP_LOG_XP = 5;            // Logged AM + PM weight
var MAX_DAILY_XP_BASE = 180;         // Before streak multiplier

// Weekly review XP
var WEEKLY_REVIEW_XP = 50;
var WEEKLY_80_PERCENT_BONUS = 25;    // 80%+ habit completion
var WEEKLY_100_PERCENT_BONUS = 75;   // 100% habit completion (replaces 80% bonus)
var WEEKLY_MRR_GROWTH_BONUS = 25;    // MRR grew week-over-week

// Milestone XP (one-time)
var MRR_MILESTONE_XP = 500;          // Per $5k increment
var MRR_30K_XP = 2000;
var MRR_100K_XP = 5000;
var BODY_FAT_TARGET_XP = 2000;

// ============================================================
// STREAK CONFIG
// ============================================================
var STREAK_MULTIPLIERS = [
  { minDays: 1,  maxDays: 6,   multiplier: 1.0 },
  { minDays: 7,  maxDays: 13,  multiplier: 1.2 },
  { minDays: 14, maxDays: 20,  multiplier: 1.4 },
  { minDays: 21, maxDays: 29,  multiplier: 1.6 },
  { minDays: 30, maxDays: 59,  multiplier: 1.8 },
  { minDays: 60, maxDays: 89,  multiplier: 2.0 },
  { minDays: 90, maxDays: 9999, multiplier: 2.5 }
];

var INITIAL_STREAK_FREEZES = 2;
var MAX_STREAK_FREEZES = 3;
var STREAK_FREEZE_EARN_INTERVAL = 14; // Earn 1 freeze every N-day streak
var STREAK_FREEZE_XP_COST = 50;

// Phoenix mechanic: 2x XP for 3 days after returning from 3+ day break
var PHOENIX_MULTIPLIER = 2.0;
var PHOENIX_DURATION_DAYS = 3;
var PHOENIX_TRIGGER_MISSED_DAYS = 3;

// ============================================================
// LEVELS (XP = 100 * level^1.5)
// ============================================================
var MAX_LEVEL = 50;

var LEVEL_TITLES = {
  1:  'Tawbah',       // Repentance — the starting point
  2:  'Tawbah',
  3:  'Niyyah',       // Intention — you\'ve committed
  4:  'Niyyah',
  5:  'Mureed',       // Seeker — actively pursuing
  6:  'Mureed',
  7:  'Salik',        // Traveler — on the path
  8:  'Salik',
  9:  'Salik',
  10: 'Mujtahid',     // Striver — putting in real effort
  11: 'Mujtahid',
  12: 'Mujtahid',
  13: 'Mujtahid',
  14: 'Mujtahid',
  15: 'Sabir',        // Patient One — enduring through difficulty
  16: 'Sabir',
  17: 'Sabir',
  18: 'Sabir',
  19: 'Sabir',
  20: 'Mutqin',       // One of Excellence
  21: 'Mutqin',
  22: 'Mutqin',
  23: 'Mutqin',
  24: 'Mutqin',
  25: 'Mujahid',      // One Who Struggles — in the best sense
  26: 'Mujahid',
  27: 'Mujahid',
  28: 'Mujahid',
  29: 'Mujahid',
  30: 'Istiqamah',    // Steadfast — the ultimate consistency
  31: 'Istiqamah',
  32: 'Istiqamah',
  33: 'Istiqamah',
  34: 'Istiqamah',
  35: 'Istiqamah',
  36: 'Istiqamah',
  37: 'Istiqamah',
  38: 'Istiqamah',
  39: 'Istiqamah',
  40: 'Muhsin',       // One of Ihsan — excellence in everything
  41: 'Muhsin',
  42: 'Muhsin',
  43: 'Muhsin',
  44: 'Muhsin',
  45: 'Muhsin',
  46: 'Muhsin',
  47: 'Muhsin',
  48: 'Muhsin',
  49: 'Muhsin',
  50: 'Khalifah'      // Vicegerent — fulfilling your purpose on earth
};

function getLevelXP(level) {
  return Math.round(100 * Math.pow(level, 1.5));
}

function getLevelTitle(level) {
  if (level >= 50) return LEVEL_TITLES[50];
  return LEVEL_TITLES[level] || 'Tawbah';
}

function getLevelFromXP(totalXP) {
  for (var lvl = MAX_LEVEL; lvl >= 1; lvl--) {
    if (totalXP >= getLevelXP(lvl)) return lvl;
  }
  return 1;
}

function getStreakMultiplier(streakDays) {
  for (var i = STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (streakDays >= STREAK_MULTIPLIERS[i].minDays) {
      return STREAK_MULTIPLIERS[i].multiplier;
    }
  }
  return 1.0;
}

// ============================================================
// GOALS
// ============================================================
var GOALS = {
  mrr30k: { target: 30000, deadline: '2026-04-01', label: '$30k MRR' },
  mrr100k: { target: 100000, deadline: '2026-06-01', label: '$100k MRR' },
  sixPack: { targetBodyFat: 12, label: '6-Pack' }
};

var MRR_MILESTONES = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

// ============================================================
// SHEET NAMES
// ============================================================
var SHEET_NAMES = {
  DASHBOARD: 'Dashboard',
  DAILY_LOG: 'Daily Log',
  WEEKLY_REVIEW: 'Weekly Review',
  CHARTS: 'Charts',
  ACHIEVEMENTS: 'Achievements',
  WISDOM: 'Wisdom',
  CONFIG: 'Config',
  DATA: 'Data',
  BODY_COMP: 'Body Comp',
  MEALS: 'Meals'
};

// ============================================================
// DAILY LOG COLUMN MAPPING (1-indexed)
// ============================================================
var DL = {
  DATE: 1,
  COMPLETED: 2,
  // Habits: columns 3-9
  HABIT_START: 3,
  HABIT_END: 9,
  // Attributes: columns 10-15
  ATTR_START: 10,
  ATTR_END: 15,
  HABITS_SCORE: 16,
  ATTR_AVG: 17,
  MRR: 18,
  WEIGHT: 19,
  BODY_FAT: 20,
  WIN_OF_DAY: 21,
  XP_EARNED: 22,
  TOTAL_XP: 23,
  STREAK: 24,
  NOTES: 25,  // Internal notes (Phoenix status, etc.)
  // Whoop columns (auto-populated from API)
  WHOOP_RECOVERY: 26,   // Recovery score 0-100%
  WHOOP_HRV: 27,        // HRV RMSSD in ms
  WHOOP_RESTING_HR: 28, // Resting heart rate in bpm
  WHOOP_SLEEP: 29,      // Sleep performance 0-100%
  WHOOP_STRAIN: 30,     // Day strain score 0-21
  DIET_SCORE: 31,       // 1-5 self-rating diet compliance
  CALORIES_EST: 32      // Estimated calories consumed
};

// ============================================================
// BODY COMP COLUMN MAPPING (Body Comp sheet, 1-indexed)
// ============================================================
var BC = {
  DATE: 1,
  AM_WEIGHT: 2,
  PM_WEIGHT: 3,
  DAILY_AVG: 4,
  SEVEN_DAY_AVG: 5,
  DELTA: 6,
  BODY_FAT: 7,
  LEAN_MASS: 8,
  NOTES: 9
};

// ============================================================
// CUT PLAN CONSTANTS
// ============================================================
var CUT = {
  START_WEIGHT: 173.2,
  START_BF: 18.6,
  TARGET_BF: 12,
  TARGET_WEIGHT: 160,       // ~141 lb lean mass / 0.88
  TDEE: 2866,
  DAILY_CALORIES: 2350,
  PROTEIN_G: 190,
  FAT_G: 80,
  CARBS_G: 100,
  RATE_PER_WEEK: 1.0        // Target lb/week loss
};

// ============================================================
// COLORS  (green + white game theme)
// ============================================================
var COLORS = {
  HEADER_BG: '#2e7d32',        // Dark green — all section headers
  HEADER_TEXT: '#ffffff',       // White text on dark headers
  DARK_GREEN: '#1b5e20',        // Deeper green for player card
  MED_GREEN: '#43a047',         // Medium green for sub-headers
  LIGHT_GREEN: '#e8f5e9',       // Very light green backgrounds
  ACCENT_GOLD: '#f9a825',       // Bright gold — XP, level
  ACCENT_GREEN: '#43a047',      // Green accents
  ACCENT_RED: '#e53935',        // Red
  ACCENT_BLUE: '#1565c0',       // Deep blue (MRR goals)
  ROW_EVEN: '#f9fbe7',          // Light green-white alternating row
  ROW_ODD: '#ffffff',           // White
  STREAK_ACTIVE: '#43a047',     // Active streak green
  STREAK_BROKEN: '#e53935',     // Broken streak red
  XP_BAR: '#f9a825',            // Gold XP bar
  PERFECT_DAY: '#ffd600',       // Bright yellow perfect day
  HABIT_DONE: '#a5d6a7',        // Grid cell — completed habit
  HABIT_MISSED: '#ffcdd2',      // Grid cell — missed habit
  HABIT_FUTURE: '#f5f5f5',      // Grid cell — future (not yet)
  ATTR_LOW: '#ffcdd2',
  ATTR_MED: '#fff9c4',
  ATTR_HIGH: '#c8e6c9'
};
