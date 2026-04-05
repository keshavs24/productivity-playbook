/**
 * config.ts — All game constants, ported from src/Config.js + docs/config.js
 * Single source of truth for the entire app.
 */

// ============================================================
// HABITS
// ============================================================
export const HABITS = [
  'Wake Before Fajr',
  'Prayers (2+)',
  'Workout',
  'Deep Work 4h+',
  'Ship Something',
  'Quran Reading',
  'Read 30 Min',
] as const

export type HabitKey =
  | 'wake_fajr'
  | 'prayers'
  | 'workout'
  | 'deep_work'
  | 'ship'
  | 'quran'
  | 'read'

export const HABIT_KEYS: HabitKey[] = [
  'wake_fajr',
  'prayers',
  'workout',
  'deep_work',
  'ship',
  'quran',
  'read',
]

// ============================================================
// ATTRIBUTES (daily 1-5 self-rating)
// ============================================================
export const ATTRIBUTES = [
  'Discipline',
  'Focus',
  'Confidence',
  'Deen',
  'Mental Toughness',
  'Reliability',
] as const

export type AttributeKey =
  | 'discipline'
  | 'focus'
  | 'confidence'
  | 'deen'
  | 'mental_toughness'
  | 'reliability'

export const ATTRIBUTE_KEYS: AttributeKey[] = [
  'discipline',
  'focus',
  'confidence',
  'deen',
  'mental_toughness',
  'reliability',
]

// ============================================================
// XP VALUES
// ============================================================
export const XP_PER_HABIT = 10
export const PERFECT_DAY_BONUS = 30 // All 7 habits
export const XP_PER_ATTRIBUTE = 3
export const ALL_ATTRIBUTES_BONUS = 12 // All 6 rated
export const MRR_LOG_XP = 5
export const WEIGHT_LOG_XP = 5
export const WIN_OF_DAY_XP = 10
export const DIET_PERFECT_XP = 15 // Diet score of 5
export const DIET_LOG_XP = 5 // Any diet score
export const PRAYER_XP_PER_FARD = 5
export const PRAYER_XP_PER_SUNNAH = 2
export const PRAYER_ALL_FARD_BONUS = 15
export const PRAYER_ALL_PRAYERS_BONUS = 25
export const NUTRITION_LOG_XP = 5
export const LIFT_LOG_XP = 10
export const LIFT_PR_XP = 20
export const REVENUE_HOUR_XP = 5 // Per hour of revenue work
export const REVENUE_TARGET_BONUS = 30 // Hit 6h target
export const NON_NEGOTIABLE_STREAK_BONUS = 20 // All 3 kept
export const MAX_DAILY_XP_BASE = 300 // Before streak multiplier

// Weekly review XP
export const WEEKLY_REVIEW_XP = 50
export const WEEKLY_80_PERCENT_BONUS = 25
export const WEEKLY_100_PERCENT_BONUS = 75
export const WEEKLY_MRR_GROWTH_BONUS = 25

// Revenue hour overtime bonuses
export const REVENUE_OVERTIME_MULTIPLIERS = [
  { hours: 8, multiplier: 1.5 },
  { hours: 7, multiplier: 1.25 },
  { hours: 6.5, multiplier: 1.1 },
] as const

// ============================================================
// STREAK CONFIG
// ============================================================
export const STREAK_MULTIPLIERS = [
  { minDays: 1, maxDays: 6, multiplier: 1.0 },
  { minDays: 7, maxDays: 13, multiplier: 1.2 },
  { minDays: 14, maxDays: 20, multiplier: 1.4 },
  { minDays: 21, maxDays: 29, multiplier: 1.6 },
  { minDays: 30, maxDays: 59, multiplier: 1.8 },
  { minDays: 60, maxDays: 89, multiplier: 2.0 },
  { minDays: 90, maxDays: 9999, multiplier: 2.5 },
] as const

export const INITIAL_STREAK_FREEZES = 2
export const MAX_STREAK_FREEZES = 3
export const STREAK_FREEZE_EARN_INTERVAL = 14
export const STREAK_FREEZE_XP_COST = 50

// Phoenix mechanic
export const PHOENIX_MULTIPLIER = 2.0
export const PHOENIX_DURATION_DAYS = 3
export const PHOENIX_TRIGGER_MISSED_DAYS = 3

// ============================================================
// LEVELS (XP = 100 * level^1.5)
// ============================================================
export const MAX_LEVEL = 50

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Tawbah', 2: 'Tawbah',
  3: 'Niyyah', 4: 'Niyyah',
  5: 'Mureed', 6: 'Mureed',
  7: 'Salik', 8: 'Salik', 9: 'Salik',
  10: 'Mujtahid', 11: 'Mujtahid', 12: 'Mujtahid', 13: 'Mujtahid', 14: 'Mujtahid',
  15: 'Sabir', 16: 'Sabir', 17: 'Sabir', 18: 'Sabir', 19: 'Sabir',
  20: 'Mutqin', 21: 'Mutqin', 22: 'Mutqin', 23: 'Mutqin', 24: 'Mutqin',
  25: 'Mujahid', 26: 'Mujahid', 27: 'Mujahid', 28: 'Mujahid', 29: 'Mujahid',
  30: 'Istiqamah', 31: 'Istiqamah', 32: 'Istiqamah', 33: 'Istiqamah', 34: 'Istiqamah',
  35: 'Istiqamah', 36: 'Istiqamah', 37: 'Istiqamah', 38: 'Istiqamah', 39: 'Istiqamah',
  40: 'Muhsin', 41: 'Muhsin', 42: 'Muhsin', 43: 'Muhsin', 44: 'Muhsin',
  45: 'Muhsin', 46: 'Muhsin', 47: 'Muhsin', 48: 'Muhsin', 49: 'Muhsin',
  50: 'Khalifah',
}

// ============================================================
// GOALS
// ============================================================
export const GOALS = {
  mrr30k: { target: 30000, deadline: '2026-04-01', label: '$30k MRR' },
  mrr100k: { target: 100000, deadline: '2026-06-01', label: '$100k MRR' },
  sixPack: { targetBodyFat: 12, label: '6-Pack' },
} as const

// ============================================================
// PRAYERS
// ============================================================
export interface PrayerDef {
  name: string
  key: string
  type: 'fard' | 'sunnah' | 'wajib'
  time: string
  rakahs: number
}

export const PRAYERS: PrayerDef[] = [
  { name: 'Fajr Sunnah', key: 'fajr_sunnah', type: 'sunnah', time: 'Fajr', rakahs: 2 },
  { name: 'Fajr Fard', key: 'fajr_fard', type: 'fard', time: 'Fajr', rakahs: 2 },
  { name: 'Dhuhr Sunnah Before', key: 'dhuhr_sunnah_before', type: 'sunnah', time: 'Dhuhr', rakahs: 4 },
  { name: 'Dhuhr Fard', key: 'dhuhr_fard', type: 'fard', time: 'Dhuhr', rakahs: 4 },
  { name: 'Dhuhr Sunnah After', key: 'dhuhr_sunnah_after', type: 'sunnah', time: 'Dhuhr', rakahs: 2 },
  { name: 'Asr Fard', key: 'asr_fard', type: 'fard', time: 'Asr', rakahs: 4 },
  { name: 'Maghrib Fard', key: 'maghrib_fard', type: 'fard', time: 'Maghrib', rakahs: 3 },
  { name: 'Maghrib Sunnah', key: 'maghrib_sunnah', type: 'sunnah', time: 'Maghrib', rakahs: 2 },
  { name: 'Isha Fard', key: 'isha_fard', type: 'fard', time: 'Isha', rakahs: 4 },
  { name: 'Isha Sunnah', key: 'isha_sunnah', type: 'sunnah', time: 'Isha', rakahs: 2 },
  { name: 'Witr', key: 'witr', type: 'wajib', time: 'Isha', rakahs: 3 },
]

export const FARD_PRAYERS = PRAYERS.filter((p) => p.type === 'fard')

// ============================================================
// WORKOUT SPLIT
// ============================================================
export interface ExerciseDef {
  name: string
  targetWeight: number
  targetReps: number
  sets: number
  notes?: string
}

export interface WorkoutSession {
  name: string
  exercises: ExerciseDef[]
}

export const WORKOUT_SPLIT: WorkoutSession[] = [
  {
    name: 'Chest + Back + Abs',
    exercises: [
      { name: 'Flat DB Press', targetWeight: 80, targetReps: 8, sets: 2 },
      { name: 'Incline DB Press', targetWeight: 60, targetReps: 8, sets: 3 },
      { name: 'Pec Fly (Cable)', targetWeight: 130, targetReps: 8, sets: 4, notes: 'Last set drop' },
      { name: 'Lat Pulldown', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Cable Row', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Barbell Row', targetWeight: 0, targetReps: 8, sets: 3 },
    ],
  },
  {
    name: 'Shoulders + Arms + Abs',
    exercises: [
      { name: 'OHP (DB or BB)', targetWeight: 0, targetReps: 8, sets: 3 },
      { name: 'Lateral Raises', targetWeight: 0, targetReps: 12, sets: 3 },
      { name: 'Face Pulls', targetWeight: 0, targetReps: 15, sets: 3 },
      { name: 'Barbell Curls', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Tricep Pushdowns', targetWeight: 0, targetReps: 12, sets: 3 },
      { name: 'Hammer Curls', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Skull Crushers', targetWeight: 0, targetReps: 10, sets: 3 },
    ],
  },
  {
    name: 'Legs + Abs',
    exercises: [
      { name: 'Squat', targetWeight: 0, targetReps: 8, sets: 3 },
      { name: 'Leg Press', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'RDL', targetWeight: 0, targetReps: 8, sets: 3 },
      { name: 'Leg Curl', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Leg Extension', targetWeight: 0, targetReps: 10, sets: 3 },
      { name: 'Calf Raises', targetWeight: 0, targetReps: 15, sets: 3 },
    ],
  },
  { name: 'Cardio + Abs', exercises: [] },
]

export const ABS_EXERCISES: ExerciseDef[] = [
  { name: 'Plate-Loaded Ab Crunch', targetWeight: 0, targetReps: 15, sets: 3 },
  { name: 'Hanging Leg Raises', targetWeight: 0, targetReps: 12, sets: 3 },
]

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
  RATE_PER_WEEK: 1.0,
} as const

// ============================================================
// REVENUE HOURS
// ============================================================
export const REVENUE_HOURS_TARGET = 6 // Non-negotiable daily minimum
