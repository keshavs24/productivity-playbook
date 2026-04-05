/**
 * streaks.ts — Streak logic ported from src/DailyLog.js
 * Handles streak counting, freezes, and Phoenix mechanic.
 */

import {
  PHOENIX_MULTIPLIER,
  PHOENIX_DURATION_DAYS,
  PHOENIX_TRIGGER_MISSED_DAYS,
  INITIAL_STREAK_FREEZES,
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_EARN_INTERVAL,
} from '@/lib/config'

export interface StreakState {
  currentStreak: number
  longestStreak: number
  freezesRemaining: number
  phoenixActive: boolean
  phoenixDaysLeft: number
}

/**
 * Calculate streak from an array of daily log entries (most recent last).
 * Each entry needs: { date: string (YYYY-MM-DD), completed: boolean }
 */
export function calculateStreak(
  logs: { date: string; completed: boolean }[]
): number {
  if (logs.length === 0) return 0

  let streak = 0
  for (let i = logs.length - 1; i >= 0; i--) {
    if (!logs[i].completed) break

    streak++

    // Check consecutive dates
    if (i > 0) {
      const thisDate = new Date(logs[i].date)
      const prevDate = new Date(logs[i - 1].date)
      const diffDays = Math.round(
        (thisDate.getTime() - prevDate.getTime()) / 86400000
      )
      if (diffDays !== 1) break
    }
  }

  return streak
}

/**
 * Check how many consecutive days were missed (for Phoenix activation).
 */
export function countMissedDays(
  logs: { date: string; completed: boolean }[],
  today: string
): number {
  const todayDate = new Date(today)
  let missed = 0

  // Walk backwards from yesterday
  for (let d = 1; d <= 10; d++) {
    const checkDate = new Date(todayDate)
    checkDate.setDate(checkDate.getDate() - d)
    const dateStr = checkDate.toISOString().split('T')[0]

    const log = logs.find((l) => l.date === dateStr)
    if (!log || !log.completed) {
      missed++
    } else {
      break
    }
  }

  return missed
}

/**
 * Should Phoenix mechanic activate?
 */
export function shouldActivatePhoenix(missedDays: number): boolean {
  return missedDays >= PHOENIX_TRIGGER_MISSED_DAYS
}

/**
 * Get the effective XP multiplier considering Phoenix.
 */
export function getEffectiveMultiplier(
  streakMultiplier: number,
  phoenixActive: boolean
): number {
  if (phoenixActive) {
    return Math.max(streakMultiplier, PHOENIX_MULTIPLIER)
  }
  return streakMultiplier
}

/**
 * Calculate earned freezes based on streak length.
 */
export function calculateEarnedFreezes(streak: number): number {
  const earned = Math.floor(streak / STREAK_FREEZE_EARN_INTERVAL)
  return Math.min(INITIAL_STREAK_FREEZES + earned, MAX_STREAK_FREEZES)
}

/**
 * Process end-of-day streak update.
 * Returns the new streak state.
 */
export function processStreakUpdate(
  currentState: StreakState,
  todayCompleted: boolean,
  missedDays: number
): StreakState {
  const newState = { ...currentState }

  if (todayCompleted) {
    newState.currentStreak += 1
    newState.longestStreak = Math.max(
      newState.longestStreak,
      newState.currentStreak
    )

    // Check if Phoenix should deactivate
    if (newState.phoenixActive) {
      newState.phoenixDaysLeft -= 1
      if (newState.phoenixDaysLeft <= 0) {
        newState.phoenixActive = false
        newState.phoenixDaysLeft = 0
      }
    }

    // Earn freezes on milestones
    newState.freezesRemaining = calculateEarnedFreezes(newState.currentStreak)
  } else {
    // Day missed
    if (newState.freezesRemaining > 0 && newState.currentStreak > 0) {
      // Use a freeze — streak preserved
      newState.freezesRemaining -= 1
    } else {
      // Streak broken
      newState.currentStreak = 0

      // Check Phoenix activation
      if (shouldActivatePhoenix(missedDays)) {
        newState.phoenixActive = true
        newState.phoenixDaysLeft = PHOENIX_DURATION_DAYS
      }
    }
  }

  return newState
}
