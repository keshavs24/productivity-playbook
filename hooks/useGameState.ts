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

export interface CompleteDayResult {
  xpEarned: number
  newLevel: number
  oldLevel: number
  newStreak: number
  isPerfectDay: boolean
  phoenixActivated: boolean
  achievements: { key: string; name: string; icon: string; xp: number }[]
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
  completeDay: () => Promise<CompleteDayResult | null>
  refresh: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupaClient = ReturnType<typeof createClient>

async function buildAchievementContext(
  supabase: SupaClient,
  userId: string,
  bestStreak: number,
  totalXP: number,
): Promise<AchievementContext> {
  const [logsRes, prayerRes, liftStatsRes, foodDatesRes, bodyRes, reviewRes] = await Promise.all([
    supabase.from('daily_logs').select('date, completed, habits, attributes, mrr, diet_score, weight').eq('user_id', userId).order('date', { ascending: true }),
    supabase.from('prayer_logs').select('date, prayers').eq('user_id', userId).order('date', { ascending: true }),
    supabase.from('lift_sets').select('date, exercise, is_pr, id').eq('user_id', userId),
    supabase.from('food_logs').select('date').eq('user_id', userId),
    supabase.from('body_comp').select('date, am_weight, body_fat').eq('user_id', userId).order('date', { ascending: true }),
    supabase.from('weekly_reviews').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  const logs = (logsRes.data || []) as Array<{
    date: string; completed: boolean; habits: Record<string, boolean>;
    attributes: Record<string, number>; mrr: number | null; diet_score: number | null; weight: number | null
  }>

  // Habit counts (total times each habit was true)
  const habitCounts: Record<string, number> = {}
  const consecutiveHabit: Record<string, number> = {}
  const attrStreaks: Record<string, number> = {}
  let perfectDays = 0
  let consecutivePerfectDays = 0
  let maxConsecutivePerfect = 0
  let maxMRR = 0
  let dietStreak = 0
  let maxDietStreak = 0
  let perfectDietStreak = 0
  let maxPerfectDietStreak = 0

  // Track consecutive habit streaks
  const habitStreakCurrent: Record<string, number> = {}
  const attrStreakCurrent: Record<string, number> = {}

  for (const log of logs) {
    if (!log.completed) {
      // Reset consecutive counters
      consecutivePerfectDays = 0
      for (const k of Object.keys(habitStreakCurrent)) habitStreakCurrent[k] = 0
      for (const k of Object.keys(attrStreakCurrent)) attrStreakCurrent[k] = 0
      dietStreak = 0
      perfectDietStreak = 0
      continue
    }

    // Count habits
    const habits = log.habits || {}
    let allHabits = true
    for (const [k, v] of Object.entries(habits)) {
      if (v) {
        habitCounts[k] = (habitCounts[k] || 0) + 1
        habitStreakCurrent[k] = (habitStreakCurrent[k] || 0) + 1
      } else {
        habitStreakCurrent[k] = 0
        allHabits = false
      }
      consecutiveHabit[k] = Math.max(consecutiveHabit[k] || 0, habitStreakCurrent[k] || 0)
    }
    if (Object.keys(habits).length < 7 || !Object.values(habits).every(Boolean)) allHabits = false

    if (allHabits) {
      perfectDays++
      consecutivePerfectDays++
      maxConsecutivePerfect = Math.max(maxConsecutivePerfect, consecutivePerfectDays)
    } else {
      consecutivePerfectDays = 0
    }

    // Attributes
    const attrs = log.attributes || {}
    for (const [k, v] of Object.entries(attrs)) {
      if ((v as number) >= 4) {
        attrStreakCurrent[k] = (attrStreakCurrent[k] || 0) + 1
      } else {
        attrStreakCurrent[k] = 0
      }
      attrStreaks[k] = Math.max(attrStreaks[k] || 0, attrStreakCurrent[k] || 0)
    }

    // MRR
    if (log.mrr && log.mrr > maxMRR) maxMRR = log.mrr

    // Diet
    if ((log.diet_score || 0) >= 4) {
      dietStreak++
      maxDietStreak = Math.max(maxDietStreak, dietStreak)
    } else {
      dietStreak = 0
    }
    if ((log.diet_score || 0) === 5) {
      perfectDietStreak++
      maxPerfectDietStreak = Math.max(maxPerfectDietStreak, perfectDietStreak)
    } else {
      perfectDietStreak = 0
    }
  }

  // Perfect days this week (last 7 completed logs)
  const last7 = logs.filter(l => l.completed).slice(-7)
  const perfectDaysThisWeek = last7.filter(l => {
    const h = l.habits || {}
    return Object.keys(h).length >= 7 && Object.values(h).every(Boolean)
  }).length

  // Body comp
  const bodyLogs = bodyRes.data || []
  let consecutiveWeighIns = 0
  let lowestBF = 0
  let firstWeight = 0
  let latestWeight = 0
  for (const b of bodyLogs as Array<{ date: string; am_weight: number | null; body_fat: number | null }>) {
    if (b.am_weight) {
      consecutiveWeighIns++
      if (!firstWeight) firstWeight = b.am_weight
      latestWeight = b.am_weight
    } else {
      consecutiveWeighIns = 0
    }
    if (b.body_fat && (lowestBF === 0 || b.body_fat < lowestBF)) lowestBF = b.body_fat
  }
  const weightLost = firstWeight > 0 ? firstWeight - latestWeight : 0

  // Prayer streaks
  const prayerLogs = (prayerRes.data || []) as Array<{ date: string; prayers: Record<string, boolean> }>
  let fardStreak = 0, maxFardStreak = 0
  let witrStreak = 0, maxWitrStreak = 0
  let fullPrayerStreak = 0, maxFullPrayerStreak = 0
  for (const pl of prayerLogs) {
    const p = pl.prayers || {}
    const fards = ['fajr_fard', 'dhuhr_fard', 'asr_fard', 'maghrib_fard', 'isha_fard']
    const allFard = fards.every(k => p[k])
    if (allFard) { fardStreak++; maxFardStreak = Math.max(maxFardStreak, fardStreak) }
    else fardStreak = 0

    if (p['witr']) { witrStreak++; maxWitrStreak = Math.max(maxWitrStreak, witrStreak) }
    else witrStreak = 0

    const allPrayers = Object.values(p).filter(Boolean).length >= 11
    if (allPrayers) { fullPrayerStreak++; maxFullPrayerStreak = Math.max(maxFullPrayerStreak, fullPrayerStreak) }
    else fullPrayerStreak = 0
  }

  // Lift stats
  const liftRows = (liftStatsRes.data || []) as Array<{ date: string; exercise: string; is_pr: boolean; id: string }>
  const liftDates = new Set(liftRows.map(r => r.date))
  const prCount = liftRows.filter(r => r.is_pr).length

  // Nutrition streak
  const foodDates = new Set(((foodDatesRes.data || []) as Array<{ date: string }>).map(r => r.date))
  let nutritionStreak = 0
  let maxNutritionStreak = 0
  const allDates = [...new Set([...logs.map(l => l.date)])].sort()
  for (const d of allDates) {
    if (foodDates.has(d)) { nutritionStreak++; maxNutritionStreak = Math.max(maxNutritionStreak, nutritionStreak) }
    else nutritionStreak = 0
  }

  // Phoenix completed: user came back after a streak break and logged 3+ days
  const phoenixCompleted = bestStreak >= 3 && logs.some((l, i) => {
    if (i < 3 || !l.completed) return false
    // Check if there was a gap before this run of 3+
    const prev = logs[i - 1]
    if (!prev) return false
    const curr = new Date(l.date)
    const prevD = new Date(prev.date)
    const gap = Math.round((curr.getTime() - prevD.getTime()) / 86400000)
    return gap > 1
  })

  return {
    bestStreak,
    phoenixCompleted,
    habitCounts,
    consecutiveHabit,
    perfectDays,
    consecutivePerfectDays: maxConsecutivePerfect,
    perfectDaysThisWeek,
    attrStreaks,
    maxMRR,
    maxWeeklyMRRGrowth: 0,
    consecutiveMRRGrowthWeeks: 0,
    consecutiveWeighIns,
    bodyFatTarget: false,
    lowestBF,
    weightLost: Math.max(0, weightLost),
    dietStreak: maxDietStreak,
    perfectDietStreak: maxPerfectDietStreak,
    liftSessions: liftDates.size,
    prCount,
    totalSets: liftRows.length,
    fardStreak: maxFardStreak,
    witrStreak: maxWitrStreak,
    fullPrayerStreak: maxFullPrayerStreak,
    nutritionStreak: maxNutritionStreak,
    calorieAccuracyStreak: 0,
    level: getLevelFromXP(totalXP),
    totalXP,
    weeklyReviews: reviewRes.count || 0,
  }
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

  // Compute today fresh on each render so midnight rollovers work
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

  // Fetch all data — recompute `today` inside callback to handle midnight rollover
  const fetchData = useCallback(async () => {
    const fetchToday = getToday()
    try {
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [charRes, logRes, prayerRes, revenueRes, bodyRes, nutritionRes, liftRes] = await Promise.all([
        supabase.from('characters').select('*').eq('user_id', user.id).single(),
        supabase.from('daily_logs').select('*').eq('user_id', user.id).eq('date', fetchToday).single(),
        supabase.from('prayer_logs').select('*').eq('user_id', user.id).eq('date', fetchToday).single(),
        supabase.from('revenue_blocks').select('*').eq('user_id', user.id).eq('date', fetchToday).order('start_time', { ascending: true }),
        supabase.from('body_comp').select('*').eq('user_id', user.id).eq('date', fetchToday).single(),
        supabase.from('food_logs').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('date', fetchToday),
        supabase.from('lift_sets').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('date', fetchToday),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const completeDay = async (): Promise<CompleteDayResult | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !character) return null

    try {
      // Calculate final XP
      const finalXP = xpBreakdown.total
      const oldLevel = getLevelFromXP(character.total_xp)

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
        .order('date', { ascending: false })
        .limit(100)

      const missedDays = countMissedDays(recentLogs || [], today)

      const currentState: StreakState = {
        currentStreak: character.current_streak,
        longestStreak: character.longest_streak,
        freezesRemaining: character.streak_freezes,
        phoenixActive: character.phoenix_active,
        phoenixDaysLeft: character.phoenix_days,
      }

      const newStreakState = processStreakUpdate(currentState, true, missedDays)
      const newTotalXP = character.total_xp + finalXP
      const newLevel = getLevelFromXP(newTotalXP)

      // Update character
      const updatedChar = {
        ...character,
        total_xp: newTotalXP,
        current_streak: newStreakState.currentStreak,
        longest_streak: newStreakState.longestStreak,
        streak_freezes: newStreakState.freezesRemaining,
        phoenix_active: newStreakState.phoenixActive,
        phoenix_days: newStreakState.phoenixDaysLeft,
      }

      setCharacter(updatedChar)

      const { error: charError } = await supabase.from('characters').update({
        total_xp: newTotalXP,
        current_streak: newStreakState.currentStreak,
        longest_streak: newStreakState.longestStreak,
        streak_freezes: newStreakState.freezesRemaining,
        phoenix_active: newStreakState.phoenixActive,
        phoenix_days: newStreakState.phoenixDaysLeft,
      }).eq('id', character.id)

      if (charError) throw charError

      // Check for perfect day
      const isPerfectDay = Object.keys(dailyLog.habits).length >= 7 &&
        Object.values(dailyLog.habits).every(Boolean)

      // Check for new achievements
      let unlockedAchievements: { key: string; name: string; icon: string; xp: number }[] = []
      try {
        const { data: unlockedRows } = await supabase
          .from('achievements')
          .select('key')
          .eq('user_id', user.id)

        const unlockedSet = new Set((unlockedRows || []).map((r: { key: string }) => r.key))

        const ctx = await buildAchievementContext(supabase, user.id, newStreakState.longestStreak, newTotalXP)

        const newlyUnlocked = checkNewAchievements(ctx, unlockedSet)
        if (newlyUnlocked.length > 0) {
          await supabase.from('achievements').insert(
            newlyUnlocked.map((a) => ({
              user_id: user.id,
              key: a.key,
              xp_awarded: a.xp,
            }))
          )
          unlockedAchievements = newlyUnlocked.map(a => ({
            key: a.key,
            name: a.name,
            icon: a.icon,
            xp: a.xp,
          }))
        }
      } catch (err) {
        console.error('Achievement check failed:', err)
      }

      return {
        xpEarned: finalXP,
        newLevel,
        oldLevel,
        newStreak: newStreakState.currentStreak,
        isPerfectDay,
        phoenixActivated: newStreakState.phoenixActive && !character.phoenix_active,
        achievements: unlockedAchievements,
      }
    } catch (err) {
      console.error('Failed to complete day:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete day')
      return null
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
