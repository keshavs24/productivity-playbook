'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateDailyXP, type DailyData, type XPBreakdown } from '@/lib/game/xp'
import { getLevelFromXP, getLevelTitle, getLevelProgress, getXPToNextLevel, getLevelXP } from '@/lib/game/levels'
import { getStreakMultiplier } from '@/lib/game/xp'
import { processStreakUpdate, countMissedDays, type StreakState } from '@/lib/game/streaks'
import { checkNewAchievements, type AchievementContext } from '@/lib/game/achievements'
import {
  HABITS,
  HABIT_KEYS,
  ATTRIBUTES,
  ATTRIBUTE_KEYS,
  REVENUE_HOURS_TARGET,
  type HabitKey,
  type AttributeKey,
} from '@/lib/config'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export interface Character {
  id: string
  user_id: string
  name: string
  level: number
  total_xp: number
  current_streak: number
  longest_streak: number
  streak_freezes: number
  phoenix_active: boolean
  phoenix_days: number
}

export interface DailyLog {
  id?: string
  user_id?: string
  date: string
  completed: boolean
  habits: Record<string, boolean>
  attributes: Record<string, number>
  mrr: number | null
  weight: number | null
  body_fat: number | null
  win_of_day: string | null
  diet_score: number | null
  calories_est: number | null
  niyyah: string | null
  xp_earned: number
  xp_breakdown: Record<string, number>
  streak_day: number
  notes: string | null
}

export interface RevenueBlock {
  id: string
  date: string
  start_time: string
  end_time: string | null
  duration_min: number | null
  description: string | null
  category: string | null
  is_revenue: boolean
}

export interface PrayerLog {
  id?: string
  date: string
  prayers: Record<string, boolean>
  fajr_done: boolean
  second_prayer_done: boolean
}

export interface BodyComp {
  id?: string
  date: string
  am_weight: number | null
  pm_weight: number | null
  body_fat: number | null
  notes: string | null
}

interface GameState {
  loading: boolean
  error: string | null
  character: Character | null
  dailyLog: DailyLog
  prayerLog: PrayerLog
  revenueBlocks: RevenueBlock[]
  bodyComp: BodyComp | null
  xpBreakdown: XPBreakdown
  // Computed
  level: number
  levelTitle: string
  levelProgress: number
  xpToNext: number
  currentLevelXP: number
  nextLevelXP: number
  streakMultiplier: number
  totalRevenueMinutes: number
  totalRevenueHours: number
  nonNegotiablesMet: { revenue: boolean; fajr: boolean; secondPrayer: boolean; all: boolean }
}

interface GameActions {
  toggleHabit: (key: HabitKey) => Promise<void>
  setAttribute: (key: AttributeKey, value: number) => Promise<void>
  updateDailyField: (field: string, value: unknown) => Promise<void>
  togglePrayer: (key: string) => Promise<void>
  saveBodyComp: (data: Partial<BodyComp>) => Promise<void>
  addRevenueBlock: (block: Omit<RevenueBlock, 'id'>) => Promise<void>
  completeDay: () => Promise<void>
  refresh: () => Promise<void>
}

const defaultDailyLog: DailyLog = {
  date: getToday(),
  completed: false,
  habits: {},
  attributes: {},
  mrr: null,
  weight: null,
  body_fat: null,
  win_of_day: null,
  diet_score: null,
  calories_est: null,
  niyyah: null,
  xp_earned: 0,
  xp_breakdown: {},
  streak_day: 0,
  notes: null,
}

const defaultPrayerLog: PrayerLog = {
  date: getToday(),
  prayers: {},
  fajr_done: false,
  second_prayer_done: false,
}

const defaultBreakdown: XPBreakdown = {
  habits: 0, perfectDay: 0, attributes: 0, allAttributes: 0,
  mrr: 0, weight: 0, winOfDay: 0, diet: 0, prayer: 0,
  nutrition: 0, lifts: 0, revenue: 0, nonNegotiables: 0,
  subtotal: 0, multiplier: 1, total: 0,
}

export function useGameState(): GameState & GameActions {
  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState<Character | null>(null)
  const [dailyLog, setDailyLog] = useState<DailyLog>(defaultDailyLog)
  const [prayerLog, setPrayerLog] = useState<PrayerLog>(defaultPrayerLog)
  const [revenueBlocks, setRevenueBlocks] = useState<RevenueBlock[]>([])
  const [bodyComp, setBodyComp] = useState<BodyComp | null>(null)
  const [hasNutritionLog, setHasNutritionLog] = useState(false)
  const [hasLiftLog, setHasLiftLog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const today = getToday()

  // Compute XP breakdown from current state
  const totalRevenueMinutes = revenueBlocks.reduce((sum, b) => sum + (b.duration_min || 0), 0)
  const totalRevenueHours = totalRevenueMinutes / 60

  const nonNegotiablesMet = {
    revenue: totalRevenueHours >= REVENUE_HOURS_TARGET,
    fajr: prayerLog.fajr_done,
    secondPrayer: prayerLog.second_prayer_done,
    all: totalRevenueHours >= REVENUE_HOURS_TARGET && prayerLog.fajr_done && prayerLog.second_prayer_done,
  }

  const dailyData: DailyData = {
    habits: dailyLog.habits as Partial<Record<HabitKey, boolean>>,
    attributes: dailyLog.attributes as Partial<Record<AttributeKey, number>>,
    mrr: dailyLog.mrr,
    weight: dailyLog.weight || bodyComp?.am_weight || bodyComp?.pm_weight,
    winOfDay: dailyLog.win_of_day,
    dietScore: dailyLog.diet_score,
    prayers: prayerLog.prayers,
    hasNutritionLog,
    hasLiftLog,
    revenueHours: totalRevenueHours,
    nonNegotiablesKept: nonNegotiablesMet.all,
  }

  const streak = character?.current_streak || 0
  const xpBreakdown = calculateDailyXP(dailyData, streak)

  const level = character ? getLevelFromXP(character.total_xp) : 1
  const levelTitle = getLevelTitle(level)
  const levelProgress = character ? getLevelProgress(character.total_xp) : 0
  const xpToNext = character ? getXPToNextLevel(character.total_xp) : 100
  const currentLevelXP = getLevelXP(level)
  const nextLevelXP = getLevelXP(Math.min(level + 1, 50))
  const streakMultiplier = getStreakMultiplier(streak)

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [charRes, logRes, prayerRes, revenueRes, bodyRes, nutritionRes, liftRes] = await Promise.all([
        supabase.from('characters').select('*').eq('user_id', user.id).single(),
        supabase.from('daily_logs').select('*').eq('user_id', user.id).eq('date', today).single(),
        supabase.from('prayer_logs').select('*').eq('user_id', user.id).eq('date', today).single(),
        supabase.from('revenue_blocks').select('*').eq('user_id', user.id).eq('date', today).order('start_time', { ascending: true }),
        supabase.from('body_comp').select('*').eq('user_id', user.id).eq('date', today).single(),
        supabase.from('food_logs').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('date', today),
        supabase.from('lift_sets').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('date', today),
      ])

      if (charRes.data) setCharacter(charRes.data)
      if (logRes.data) setDailyLog(logRes.data)
      if (prayerRes.data) setPrayerLog(prayerRes.data)
      if (revenueRes.data) setRevenueBlocks(revenueRes.data)
      if (bodyRes.data) setBodyComp(bodyRes.data)
      setHasNutritionLog((nutritionRes.count || 0) > 0)
      setHasLiftLog((liftRes.count || 0) > 0)
    } catch (err) {
      console.error('Failed to fetch game state:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Revalidate on window focus
  useEffect(() => {
    const onFocus = () => fetchData()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchData])

  // Upsert daily log helper
  const upsertDailyLog = async (updates: Partial<DailyLog>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newLog = { ...dailyLog, ...updates, date: today }
    setDailyLog(newLog)

    await supabase.from('daily_logs').upsert({
      user_id: user.id,
      ...newLog,
    }, { onConflict: 'user_id,date' })
  }

  // Upsert prayer log helper
  const upsertPrayerLog = async (updates: Partial<PrayerLog>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newLog = { ...prayerLog, ...updates, date: today }
    setPrayerLog(newLog)

    await supabase.from('prayer_logs').upsert({
      user_id: user.id,
      ...newLog,
    }, { onConflict: 'user_id,date' })
  }

  const toggleHabit = async (key: HabitKey) => {
    const newHabits = { ...dailyLog.habits, [key]: !dailyLog.habits[key] }
    await upsertDailyLog({ habits: newHabits })
  }

  const setAttribute = async (key: AttributeKey, value: number) => {
    const newAttrs = { ...dailyLog.attributes, [key]: value }
    await upsertDailyLog({ attributes: newAttrs })
  }

  const updateDailyField = async (field: string, value: unknown) => {
    await upsertDailyLog({ [field]: value } as Partial<DailyLog>)
  }

  const togglePrayer = async (key: string) => {
    const newPrayers = { ...prayerLog.prayers, [key]: !prayerLog.prayers[key] }
    const fajrDone = !!newPrayers['fajr_fard']
    const secondPrayerDone = !!newPrayers['maghrib_fard'] || !!newPrayers['isha_fard']

    await upsertPrayerLog({
      prayers: newPrayers,
      fajr_done: fajrDone,
      second_prayer_done: secondPrayerDone,
    })
  }

  const saveBodyComp = async (data: Partial<BodyComp>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newComp = { ...bodyComp, ...data, date: today } as BodyComp
    setBodyComp(newComp)

    await supabase.from('body_comp').upsert({
      user_id: user.id,
      ...newComp,
    }, { onConflict: 'user_id,date' })
  }

  const addRevenueBlock = async (block: Omit<RevenueBlock, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('revenue_blocks').insert({
      user_id: user.id,
      ...block,
    }).select().single()

    if (data) {
      setRevenueBlocks(prev => [...prev, data])
    }
  }

  const completeDay = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !character) return

    // Calculate final XP
    const finalXP = xpBreakdown.total

    // Update daily log
    await upsertDailyLog({
      completed: true,
      xp_earned: finalXP,
      xp_breakdown: xpBreakdown as unknown as Record<string, number>,
    })

    // Fetch recent logs for streak calculation
    const { data: recentLogs } = await supabase
      .from('daily_logs')
      .select('date, completed')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(30)

    const missedDays = countMissedDays(recentLogs || [], today)

    const currentState: StreakState = {
      currentStreak: character.current_streak,
      longestStreak: character.longest_streak,
      freezesRemaining: character.streak_freezes,
      phoenixActive: character.phoenix_active,
      phoenixDaysLeft: character.phoenix_days,
    }

    const newStreak = processStreakUpdate(currentState, true, missedDays)
    const newTotalXP = character.total_xp + finalXP

    // Update character
    const updatedChar = {
      ...character,
      total_xp: newTotalXP,
      current_streak: newStreak.currentStreak,
      longest_streak: newStreak.longestStreak,
      streak_freezes: newStreak.freezesRemaining,
      phoenix_active: newStreak.phoenixActive,
      phoenix_days: newStreak.phoenixDaysLeft,
    }

    setCharacter(updatedChar)

    await supabase.from('characters').update({
      total_xp: newTotalXP,
      current_streak: newStreak.currentStreak,
      longest_streak: newStreak.longestStreak,
      streak_freezes: newStreak.freezesRemaining,
      phoenix_active: newStreak.phoenixActive,
      phoenix_days: newStreak.phoenixDaysLeft,
    }).eq('id', character.id)

    // Check for new achievements
    try {
      const { data: unlockedRows } = await supabase
        .from('achievements')
        .select('achievement_key')
        .eq('user_id', user.id)

      const unlockedSet = new Set((unlockedRows || []).map((r: { achievement_key: string }) => r.achievement_key))

      const ctx: AchievementContext = {
        bestStreak: newStreak.longestStreak,
        phoenixCompleted: newStreak.phoenixActive,
        habitCounts: {},
        consecutiveHabit: {},
        perfectDays: 0,
        consecutivePerfectDays: 0,
        perfectDaysThisWeek: 0,
        attrStreaks: {},
        maxMRR: dailyLog.mrr || 0,
        maxWeeklyMRRGrowth: 0,
        consecutiveMRRGrowthWeeks: 0,
        consecutiveWeighIns: bodyComp ? 1 : 0,
        bodyFatTarget: false,
        lowestBF: bodyComp?.body_fat || 0,
        weightLost: 0,
        dietStreak: (dailyLog.diet_score || 0) >= 4 ? 1 : 0,
        perfectDietStreak: (dailyLog.diet_score || 0) === 5 ? 1 : 0,
        liftSessions: hasLiftLog ? 1 : 0,
        prCount: 0,
        totalSets: 0,
        fardStreak: prayerLog.fajr_done ? 1 : 0,
        witrStreak: 0,
        fullPrayerStreak: 0,
        nutritionStreak: hasNutritionLog ? 1 : 0,
        calorieAccuracyStreak: 0,
        level: getLevelFromXP(newTotalXP),
        totalXP: newTotalXP,
        weeklyReviews: 0,
      }

      const newlyUnlocked = checkNewAchievements(ctx, unlockedSet)
      if (newlyUnlocked.length > 0) {
        await supabase.from('achievements').insert(
          newlyUnlocked.map((a) => ({
            user_id: user.id,
            achievement_key: a.key,
            xp_awarded: a.xp,
          }))
        )
      }
    } catch (err) {
      console.error('Achievement check failed:', err)
    }
  }

  return {
    loading,
    error,
    character,
    dailyLog,
    prayerLog,
    revenueBlocks,
    bodyComp,
    xpBreakdown,
    level,
    levelTitle,
    levelProgress,
    xpToNext,
    currentLevelXP,
    nextLevelXP,
    streakMultiplier,
    totalRevenueMinutes,
    totalRevenueHours,
    nonNegotiablesMet,
    toggleHabit,
    setAttribute,
    updateDailyField,
    togglePrayer,
    saveBodyComp,
    addRevenueBlock,
    completeDay,
    refresh: fetchData,
  }
}
