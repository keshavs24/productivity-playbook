/**
 * xp.ts — XP calculation engine, ported from docs/js/engine.js + src/DailyLog.js
 * Pure functions, no side effects, no API calls.
 */

import {
  HABITS,
  ATTRIBUTES,
  XP_PER_HABIT,
  PERFECT_DAY_BONUS,
  XP_PER_ATTRIBUTE,
  ALL_ATTRIBUTES_BONUS,
  MRR_LOG_XP,
  WEIGHT_LOG_XP,
  WIN_OF_DAY_XP,
  DIET_PERFECT_XP,
  DIET_LOG_XP,
  PRAYER_XP_PER_FARD,
  PRAYER_XP_PER_SUNNAH,
  PRAYER_ALL_FARD_BONUS,
  PRAYER_ALL_PRAYERS_BONUS,
  NUTRITION_LOG_XP,
  LIFT_LOG_XP,
  REVENUE_HOUR_XP,
  REVENUE_TARGET_BONUS,
  NON_NEGOTIABLE_STREAK_BONUS,
  REVENUE_HOURS_TARGET,
  PRAYERS,
  FARD_PRAYERS,
  type HabitKey,
  type AttributeKey,
  STREAK_MULTIPLIERS,
} from '@/lib/config'

export interface DailyData {
  habits: Partial<Record<HabitKey, boolean>>
  attributes: Partial<Record<AttributeKey, number>>
  mrr?: number | null
  weight?: number | null
  winOfDay?: string | null
  dietScore?: number | null
  prayers?: Record<string, boolean>
  hasNutritionLog?: boolean
  hasLiftLog?: boolean
  revenueHours?: number
  nonNegotiablesKept?: boolean // all 3 non-negotiables met
}

export interface XPBreakdown {
  habits: number
  perfectDay: number
  attributes: number
  allAttributes: number
  mrr: number
  weight: number
  winOfDay: number
  diet: number
  prayer: number
  nutrition: number
  lifts: number
  revenue: number
  nonNegotiables: number
  subtotal: number
  multiplier: number
  total: number
}

export function getStreakMultiplier(streakDays: number): number {
  for (let i = STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (streakDays >= STREAK_MULTIPLIERS[i].minDays) {
      return STREAK_MULTIPLIERS[i].multiplier
    }
  }
  return 1.0
}

export function calculateDailyXP(day: DailyData, streak: number = 0): XPBreakdown {
  const breakdown: XPBreakdown = {
    habits: 0,
    perfectDay: 0,
    attributes: 0,
    allAttributes: 0,
    mrr: 0,
    weight: 0,
    winOfDay: 0,
    diet: 0,
    prayer: 0,
    nutrition: 0,
    lifts: 0,
    revenue: 0,
    nonNegotiables: 0,
    subtotal: 0,
    multiplier: 1,
    total: 0,
  }

  // Habit XP
  const habitsCompleted = Object.values(day.habits).filter(Boolean).length
  breakdown.habits = habitsCompleted * XP_PER_HABIT

  // Perfect day bonus
  if (habitsCompleted === HABITS.length) {
    breakdown.perfectDay = PERFECT_DAY_BONUS
  }

  // Attribute XP
  const attrsRated = Object.values(day.attributes).filter(
    (v) => v !== undefined && v !== null && v >= 1 && v <= 5
  ).length
  breakdown.attributes = attrsRated * XP_PER_ATTRIBUTE

  if (attrsRated === ATTRIBUTES.length) {
    breakdown.allAttributes = ALL_ATTRIBUTES_BONUS
  }

  // MRR logging
  if (day.mrr && day.mrr > 0) {
    breakdown.mrr = MRR_LOG_XP
  }

  // Weight logging
  if (day.weight && day.weight > 0) {
    breakdown.weight = WEIGHT_LOG_XP
  }

  // Win of the day
  if (day.winOfDay && day.winOfDay.trim().length > 0) {
    breakdown.winOfDay = WIN_OF_DAY_XP
  }

  // Diet
  if (day.dietScore && day.dietScore >= 1) {
    breakdown.diet = DIET_LOG_XP
    if (day.dietScore === 5) {
      breakdown.diet += DIET_PERFECT_XP
    }
  }

  // Prayer XP
  if (day.prayers) {
    let fardCount = 0
    let sunnahCount = 0
    for (const prayer of PRAYERS) {
      if (day.prayers[prayer.key]) {
        if (prayer.type === 'fard') fardCount++
        else sunnahCount++
      }
    }
    breakdown.prayer = fardCount * PRAYER_XP_PER_FARD + sunnahCount * PRAYER_XP_PER_SUNNAH
    if (fardCount === FARD_PRAYERS.length) breakdown.prayer += PRAYER_ALL_FARD_BONUS
    if (fardCount + sunnahCount === PRAYERS.length) breakdown.prayer += PRAYER_ALL_PRAYERS_BONUS
  }

  // Nutrition
  if (day.hasNutritionLog) {
    breakdown.nutrition = NUTRITION_LOG_XP
  }

  // Lifts
  if (day.hasLiftLog) {
    breakdown.lifts = LIFT_LOG_XP
  }

  // Revenue hours
  if (day.revenueHours && day.revenueHours > 0) {
    breakdown.revenue = Math.floor(day.revenueHours) * REVENUE_HOUR_XP
    if (day.revenueHours >= REVENUE_HOURS_TARGET) {
      breakdown.revenue += REVENUE_TARGET_BONUS
    }
  }

  // Non-negotiable streak bonus
  if (day.nonNegotiablesKept) {
    breakdown.nonNegotiables = NON_NEGOTIABLE_STREAK_BONUS
  }

  // Subtotal before multiplier
  breakdown.subtotal =
    breakdown.habits +
    breakdown.perfectDay +
    breakdown.attributes +
    breakdown.allAttributes +
    breakdown.mrr +
    breakdown.weight +
    breakdown.winOfDay +
    breakdown.diet +
    breakdown.prayer +
    breakdown.nutrition +
    breakdown.lifts +
    breakdown.revenue +
    breakdown.nonNegotiables

  // Apply streak multiplier
  breakdown.multiplier = getStreakMultiplier(streak)
  breakdown.total = Math.round(breakdown.subtotal * breakdown.multiplier)

  return breakdown
}
