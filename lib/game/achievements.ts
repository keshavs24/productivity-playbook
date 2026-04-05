/**
 * achievements.ts — 50 achievement definitions ported from src/Achievements.js
 * Pure definitions + check functions. No side effects.
 */

export interface AchievementContext {
  // Streaks
  bestStreak: number
  phoenixCompleted: boolean

  // Habit tracking
  habitCounts: Record<string, number> // Total times each habit was done
  consecutiveHabit: Record<string, number> // Current consecutive days per habit
  perfectDays: number
  consecutivePerfectDays: number
  perfectDaysThisWeek: number

  // Attributes
  attrStreaks: Record<string, number> // Consecutive days each attr >= 4

  // Business
  maxMRR: number
  maxWeeklyMRRGrowth: number
  consecutiveMRRGrowthWeeks: number

  // Fitness
  consecutiveWeighIns: number
  bodyFatTarget: boolean
  lowestBF: number
  weightLost: number

  // Diet
  dietStreak: number // Consecutive days diet score >= 4
  perfectDietStreak: number // Consecutive days diet score === 5

  // Lifts
  liftSessions: number
  prCount: number
  totalSets: number

  // Prayer
  fardStreak: number
  witrStreak: number
  fullPrayerStreak: number

  // Nutrition
  nutritionStreak: number
  calorieAccuracyStreak: number

  // Meta
  level: number
  totalXP: number
  weeklyReviews: number
}

export interface AchievementDef {
  key: string
  icon: string
  name: string
  description: string
  category: string
  xp: number
  check: (ctx: AchievementContext) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── STREAK ──
  { key: 'streak_3', icon: '🌱', name: 'First Steps', description: 'Complete a 3-day streak', category: 'Streak', xp: 50,
    check: (d) => d.bestStreak >= 3 },
  { key: 'streak_7', icon: '⚔️', name: 'Sabr Begins', description: 'Complete a 7-day streak', category: 'Streak', xp: 100,
    check: (d) => d.bestStreak >= 7 },
  { key: 'streak_14', icon: '🛡️', name: 'Fortnight of Istiqamah', description: 'Complete a 14-day streak', category: 'Streak', xp: 200,
    check: (d) => d.bestStreak >= 14 },
  { key: 'streak_30', icon: '🌙', name: 'Ramadan Warrior', description: 'Complete a 30-day streak', category: 'Streak', xp: 500,
    check: (d) => d.bestStreak >= 30 },
  { key: 'streak_90', icon: '🏔️', name: 'Quarterly Mujahid', description: 'Complete a 90-day streak', category: 'Streak', xp: 1000,
    check: (d) => d.bestStreak >= 90 },
  { key: 'phoenix', icon: '🔥', name: 'Phoenix Rising', description: 'Returned after a broken streak and logged 3 consecutive days', category: 'Streak', xp: 100,
    check: (d) => d.phoenixCompleted },

  // ── DEEN ──
  { key: 'fajr_10', icon: '🕌', name: 'Fajr Fighter x10', description: 'Woke before Fajr 10 times', category: 'Deen', xp: 150,
    check: (d) => (d.habitCounts['wake_fajr'] || 0) >= 10 },
  { key: 'fajr_30', icon: '🤲', name: 'Fajr Fighter x30', description: 'Woke before Fajr 30 times', category: 'Deen', xp: 300,
    check: (d) => (d.habitCounts['wake_fajr'] || 0) >= 30 },
  { key: 'salah_guardian', icon: '☪️', name: 'Salah Guardian', description: 'All 5 prayers for 7 straight days', category: 'Deen', xp: 300,
    check: (d) => (d.consecutiveHabit['prayers'] || 0) >= 7 },
  { key: 'quran_30', icon: '📖', name: 'Dhikr of the Consistent', description: 'Quran reading 30 days straight', category: 'Deen', xp: 500,
    check: (d) => (d.consecutiveHabit['quran'] || 0) >= 30 },
  { key: 'deen_master', icon: '⭐', name: 'Deen Master', description: 'Deen attribute average 4+ for 14 days', category: 'Deen', xp: 300,
    check: (d) => (d.attrStreaks['deen'] || 0) >= 14 },

  // ── HABITS ──
  { key: 'perfect_day', icon: '💎', name: 'Yawm Kamil (Perfect Day)', description: 'All 7 habits in one day', category: 'Habits', xp: 100,
    check: (d) => d.perfectDays >= 1 },
  { key: 'perfect_week', icon: '👑', name: 'Perfect Week', description: '100% habits for 7 consecutive days', category: 'Habits', xp: 500,
    check: (d) => d.consecutivePerfectDays >= 7 },
  { key: 'iron_5', icon: '⚡', name: 'Iron Discipline x5', description: '5 Perfect Days in a single week', category: 'Habits', xp: 250,
    check: (d) => d.perfectDaysThisWeek >= 5 },
  { key: 'gym_30', icon: '🏋️', name: 'Gym Rat x30', description: '30 workouts logged', category: 'Habits', xp: 300,
    check: (d) => (d.habitCounts['workout'] || 0) >= 30 },
  { key: 'gym_60', icon: '💪', name: 'Gym Rat x60', description: '60 workouts logged', category: 'Habits', xp: 500,
    check: (d) => (d.habitCounts['workout'] || 0) >= 60 },
  { key: 'deep_20', icon: '🧠', name: 'Deep Worker x20', description: '20 days of 4h+ deep work', category: 'Habits', xp: 200,
    check: (d) => (d.habitCounts['deep_work'] || 0) >= 20 },
  { key: 'ship_10', icon: '🚀', name: 'Ship It x10', description: 'Shipped something 10 times', category: 'Habits', xp: 150,
    check: (d) => (d.habitCounts['ship'] || 0) >= 10 },
  { key: 'read_30', icon: '📚', name: 'Bookworm x30', description: 'Read 30 min for 30 days', category: 'Habits', xp: 300,
    check: (d) => (d.habitCounts['read'] || 0) >= 30 },

  // ── BUSINESS ──
  { key: 'mrr_5k', icon: '💵', name: '$5K Club', description: 'Hit $5,000 MRR', category: 'Business', xp: 500,
    check: (d) => d.maxMRR >= 5000 },
  { key: 'mrr_10k', icon: '💰', name: '$10K Club', description: 'Hit $10,000 MRR', category: 'Business', xp: 500,
    check: (d) => d.maxMRR >= 10000 },
  { key: 'mrr_15k', icon: '🏦', name: '$15K Club', description: 'Hit $15,000 MRR', category: 'Business', xp: 500,
    check: (d) => d.maxMRR >= 15000 },
  { key: 'mrr_20k', icon: '💎', name: '$20K Club', description: 'Hit $20,000 MRR', category: 'Business', xp: 500,
    check: (d) => d.maxMRR >= 20000 },
  { key: 'mrr_25k', icon: '🏆', name: '$25K Club', description: 'Hit $25,000 MRR', category: 'Business', xp: 500,
    check: (d) => d.maxMRR >= 25000 },
  { key: 'mrr_30k', icon: '🛡️', name: 'Rizq Guardian', description: 'Hit $30,000 MRR — Target achieved!', category: 'Business', xp: 2000,
    check: (d) => d.maxMRR >= 30000 },
  { key: 'mrr_50k', icon: '⚜️', name: '$50K Club', description: 'Hit $50,000 MRR', category: 'Business', xp: 1000,
    check: (d) => d.maxMRR >= 50000 },
  { key: 'mrr_100k', icon: '👑', name: 'Rizq Master', description: 'Hit $100,000 MRR — The ultimate goal!', category: 'Business', xp: 5000,
    check: (d) => d.maxMRR >= 100000 },
  { key: 'growth_spurt', icon: '📈', name: 'Growth Spurt', description: '20%+ MRR growth in a single week', category: 'Business', xp: 300,
    check: (d) => d.maxWeeklyMRRGrowth >= 0.20 },
  { key: 'consistent_growth', icon: '📊', name: 'Consistent Growth', description: 'MRR grew every week for 4 consecutive weeks', category: 'Business', xp: 500,
    check: (d) => d.consecutiveMRRGrowthWeeks >= 4 },

  // ── FITNESS ──
  { key: 'weighin_30', icon: '⚖️', name: 'Weigh-In Warrior', description: 'Logged weight 30 days in a row', category: 'Fitness', xp: 200,
    check: (d) => d.consecutiveWeighIns >= 30 },
  { key: 'lean_machine', icon: '🎯', name: 'Lean Machine', description: 'Hit body fat target', category: 'Fitness', xp: 2000,
    check: (d) => d.bodyFatTarget },
  { key: 'beast_mode', icon: '🔥', name: 'Beast Mode', description: 'Workout streak of 21 days', category: 'Fitness', xp: 400,
    check: (d) => (d.consecutiveHabit['workout'] || 0) >= 21 },

  // ── DIET ──
  { key: 'clean_7', icon: '🥗', name: 'Clean Eater x7', description: 'Diet score 4+ for 7 consecutive days', category: 'Diet', xp: 200,
    check: (d) => d.dietStreak >= 7 },
  { key: 'omad_14', icon: '🥩', name: 'OMAD Warrior', description: 'Diet score 5 for 14 consecutive days', category: 'Diet', xp: 500,
    check: (d) => d.perfectDietStreak >= 14 },
  { key: 'omad_30', icon: '🏆', name: 'OMAD Master', description: 'Diet score 5 for 30 consecutive days', category: 'Diet', xp: 1000,
    check: (d) => d.perfectDietStreak >= 30 },
  { key: 'lost_5', icon: '📉', name: 'First 5 Down', description: 'Lost 5 lb from starting weight', category: 'Diet', xp: 300,
    check: (d) => d.weightLost >= 5 },
  { key: 'lost_10', icon: '⚖️', name: '10 lb Shredded', description: 'Lost 10 lb from starting weight', category: 'Diet', xp: 500,
    check: (d) => d.weightLost >= 10 },
  { key: 'bf_16', icon: '🔥', name: 'Sub-16% Club', description: 'Body fat below 16%', category: 'Diet', xp: 500,
    check: (d) => d.lowestBF > 0 && d.lowestBF <= 16 },
  { key: 'bf_14', icon: '💪', name: 'Sub-14% Club', description: 'Body fat below 14%', category: 'Diet', xp: 750,
    check: (d) => d.lowestBF > 0 && d.lowestBF <= 14 },
  { key: 'diet_14', icon: '⚡', name: 'No Late Night Snack x14', description: 'Diet score 4+ for 14 straight days', category: 'Diet', xp: 400,
    check: (d) => d.dietStreak >= 14 },
  { key: 'scale_30', icon: '📊', name: 'Scale Soldier', description: 'Logged weight (AM+PM) for 30 straight days', category: 'Diet', xp: 300,
    check: (d) => d.consecutiveWeighIns >= 30 },

  // ── CHARACTER ──
  { key: 'unshakeable', icon: '🗿', name: 'Unshakeable', description: 'Mental Toughness avg 4+ for 14 days', category: 'Character', xp: 300,
    check: (d) => (d.attrStreaks['mental_toughness'] || 0) >= 14 },
  { key: 'word_keeper', icon: '🤝', name: 'Man of His Word', description: 'Reliability avg 4+ for 14 days', category: 'Character', xp: 300,
    check: (d) => (d.attrStreaks['reliability'] || 0) >= 14 },
  { key: 'laser_focus', icon: '🎯', name: 'Laser Focus', description: 'Focus avg 4+ for 14 days', category: 'Character', xp: 300,
    check: (d) => (d.attrStreaks['focus'] || 0) >= 14 },
  { key: 'iron_will', icon: '🦁', name: 'Iron Will', description: 'Discipline avg 4+ for 14 days', category: 'Character', xp: 300,
    check: (d) => (d.attrStreaks['discipline'] || 0) >= 14 },
  { key: 'full_character', icon: '✨', name: 'Full Character', description: 'All 6 attributes avg 4+ for 7 days', category: 'Character', xp: 1000,
    check: (d) => {
      const keys = ['discipline', 'focus', 'confidence', 'deen', 'mental_toughness', 'reliability']
      return keys.every(k => (d.attrStreaks[k] || 0) >= 7)
    }},

  // ── LIFTS ──
  { key: 'first_lift', icon: '🏋️', name: 'First Lift', description: 'Log your first lift session', category: 'Lifts', xp: 50,
    check: (d) => d.liftSessions >= 1 },
  { key: 'iron_disciple', icon: '⚒️', name: 'Iron Disciple', description: 'Complete 30 lift sessions', category: 'Lifts', xp: 500,
    check: (d) => d.liftSessions >= 30 },
  { key: 'pr_10', icon: '💥', name: 'PR Breaker', description: 'Set 10 personal records', category: 'Lifts', xp: 300,
    check: (d) => d.prCount >= 10 },
  { key: 'volume_500', icon: '🔱', name: 'Volume King', description: 'Log 500 total sets', category: 'Lifts', xp: 500,
    check: (d) => d.totalSets >= 500 },
  { key: 'century_lifter', icon: '🦾', name: 'Century Lifter', description: 'Complete 100 lift sessions', category: 'Lifts', xp: 1000,
    check: (d) => d.liftSessions >= 100 },

  // ── PRAYER ──
  { key: 'fard_7', icon: '🕋', name: 'Fard Guardian', description: 'All 5 fard prayers for 7 consecutive days', category: 'Prayer', xp: 300,
    check: (d) => d.fardStreak >= 7 },
  { key: 'witr_30', icon: '🌙', name: 'Qiyam Al-Layl', description: 'Witr prayer for 30 consecutive days', category: 'Prayer', xp: 500,
    check: (d) => d.witrStreak >= 30 },
  { key: 'full_salah_7', icon: '✨', name: 'Full Salah x7', description: 'All 11 prayers for 7 consecutive days', category: 'Prayer', xp: 750,
    check: (d) => d.fullPrayerStreak >= 7 },
  { key: 'fard_30', icon: '🤲', name: 'Fard Guardian x30', description: 'All 5 fard prayers for 30 consecutive days', category: 'Prayer', xp: 750,
    check: (d) => d.fardStreak >= 30 },

  // ── NUTRITION ──
  { key: 'macro_7', icon: '🥗', name: 'Macro Master', description: 'Log nutrition 7 consecutive days with protein target hit', category: 'Nutrition', xp: 200,
    check: (d) => d.nutritionStreak >= 7 },
  { key: 'nutrition_30', icon: '📊', name: 'Nutrition Tracker x30', description: 'Log nutrition for 30 consecutive days', category: 'Nutrition', xp: 500,
    check: (d) => d.nutritionStreak >= 30 },
  { key: 'calorie_sniper', icon: '🎯', name: 'Calorie Sniper', description: 'Stay within 100 cal of target for 7 days', category: 'Nutrition', xp: 300,
    check: (d) => d.calorieAccuracyStreak >= 7 },

  // ── META / LEVELS ──
  { key: 'level_5', icon: '🔍', name: 'Mureed (Seeker)', description: 'Reach Level 5', category: 'Meta', xp: 100,
    check: (d) => d.level >= 5 },
  { key: 'level_10', icon: '⚔️', name: 'Mujtahid (Striver)', description: 'Reach Level 10', category: 'Meta', xp: 200,
    check: (d) => d.level >= 10 },
  { key: 'level_20', icon: '🏅', name: 'Mutqin (Excellence)', description: 'Reach Level 20', category: 'Meta', xp: 500,
    check: (d) => d.level >= 20 },
  { key: 'level_30', icon: '🏛️', name: 'Istiqamah (Steadfast)', description: 'Reach Level 30', category: 'Meta', xp: 1000,
    check: (d) => d.level >= 30 },
  { key: 'xp_10k', icon: '💫', name: 'XP 10K Club', description: 'Earn 10,000 total XP', category: 'Meta', xp: 500,
    check: (d) => d.totalXP >= 10000 },
  { key: 'reviewer_4', icon: '📋', name: 'Reviewer', description: 'Complete 4 weekly reviews', category: 'Meta', xp: 100,
    check: (d) => d.weeklyReviews >= 4 },
  { key: 'reviewer_12', icon: '📝', name: 'Consistent Reviewer', description: 'Complete 12 weekly reviews', category: 'Meta', xp: 300,
    check: (d) => d.weeklyReviews >= 12 },
]

/**
 * Check which achievements are newly unlocked given a context and set of already-unlocked keys.
 */
export function checkNewAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: Set<string>
): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.has(a.key) && a.check(ctx)
  )
}

/**
 * Get all achievement categories for grouping display.
 */
export function getAchievementCategories(): string[] {
  const cats = new Set(ACHIEVEMENTS.map((a) => a.category))
  return Array.from(cats)
}
