'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState, type CompleteDayResult } from '@/hooks/useGameState'
import { useToast } from '@/components/ui/GameToast'
import { getLevelTitle } from '@/lib/game/levels'
import {
  HABITS,
  HABIT_KEYS,
  ATTRIBUTES,
  ATTRIBUTE_KEYS,
  PRAYERS,
  FARD_PRAYERS,
  WORKOUT_SPLIT,
  ABS_EXERCISES,
  CUT,
  type HabitKey,
  type AttributeKey,
} from '@/lib/config'
import { createClient } from '@/lib/supabase/client'

const TABS = ['Habits', 'Prayers', 'Nutrition', 'Lifts', 'Body'] as const
type Tab = typeof TABS[number]

export default function TrackPage() {
  const gameState = useGameState()
  const {
    loading,
    dailyLog,
    prayerLog,
    xpBreakdown,
    bodyComp,
    nonNegotiablesMet,
    toggleHabit,
    setAttribute,
    updateDailyField,
    togglePrayer,
    saveBodyComp,
    completeDay,
  } = gameState

  const [activeTab, setActiveTab] = useState<Tab>('Habits')

  // Compute tab completion status
  const habitsCompleted = Object.values(dailyLog.habits).filter(Boolean).length
  const habitsTotal = HABIT_KEYS.length
  const attrsRated = Object.values(dailyLog.attributes).filter((v) => v > 0).length
  const prayersDone = Object.values(prayerLog.prayers).filter(Boolean).length
  const prayersTotal = PRAYERS.length

  const tabStatus: Record<Tab, 'done' | 'partial' | 'empty'> = {
    Habits: habitsCompleted === habitsTotal && attrsRated === ATTRIBUTES.length ? 'done'
      : (habitsCompleted > 0 || attrsRated > 0) ? 'partial' : 'empty',
    Prayers: prayersDone >= 5 ? 'done' : prayersDone > 0 ? 'partial' : 'empty',
    Nutrition: 'empty', // Updated by NutritionTab internally
    Lifts: 'empty',
    Body: bodyComp?.am_weight || bodyComp?.pm_weight ? 'done' : 'empty',
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Daily Tracking
        </h1>
        {xpBreakdown.subtotal > 0 && (
          <span className="stat-number text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>
            +{xpBreakdown.total} XP
          </span>
        )}
      </div>

      {/* Progress Summary Chips */}
      <div className="progress-mini">
        <span className={`progress-chip ${habitsCompleted === habitsTotal ? 'progress-chip-done' : habitsCompleted > 0 ? 'progress-chip-partial' : ''}`}>
          {habitsCompleted === habitsTotal ? '✓' : ''} Habits {habitsCompleted}/{habitsTotal}
        </span>
        <span className={`progress-chip ${prayersDone >= 5 ? 'progress-chip-done' : prayersDone > 0 ? 'progress-chip-partial' : ''}`}>
          {prayersDone >= 5 ? '✓' : ''} Prayers {prayersDone}/{prayersTotal}
        </span>
        <span className={`progress-chip ${attrsRated === ATTRIBUTES.length ? 'progress-chip-done' : attrsRated > 0 ? 'progress-chip-partial' : ''}`}>
          {attrsRated === ATTRIBUTES.length ? '✓' : ''} Attrs {attrsRated}/{ATTRIBUTES.length}
        </span>
        {dailyLog.diet_score && (
          <span className="progress-chip progress-chip-done">
            Diet {dailyLog.diet_score}/5
          </span>
        )}
      </div>

      {/* Tab Bar — sticky */}
      <div className="tab-bar-sticky">
        <div
          className="flex gap-1 p-1 rounded-lg overflow-x-auto"
          style={{ background: 'var(--bg-card)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                background: activeTab === tab ? 'var(--bg-hover)' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab}
              <span className={`tab-dot ${tabStatus[tab] === 'done' ? 'tab-dot-done' : tabStatus[tab] === 'partial' ? 'tab-dot-partial' : 'tab-dot-empty'}`} />
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Habits' && (
        <HabitsTab
          dailyLog={dailyLog}
          xpBreakdown={xpBreakdown}
          toggleHabit={toggleHabit}
          setAttribute={setAttribute}
          updateDailyField={updateDailyField}
          completeDay={completeDay}
        />
      )}
      {activeTab === 'Prayers' && (
        <PrayersTab
          prayerLog={prayerLog}
          nonNegotiablesMet={nonNegotiablesMet}
          togglePrayer={togglePrayer}
        />
      )}
      {activeTab === 'Nutrition' && <NutritionTab />}
      {activeTab === 'Lifts' && <LiftsTab />}
      {activeTab === 'Body' && (
        <BodyTab bodyComp={bodyComp} saveBodyComp={saveBodyComp} />
      )}
    </div>
  )
}

// ============================================================
// HABITS TAB
// ============================================================
function HabitsTab({
  dailyLog,
  xpBreakdown,
  toggleHabit,
  setAttribute,
  updateDailyField,
  completeDay,
}: {
  dailyLog: ReturnType<typeof useGameState>['dailyLog']
  xpBreakdown: ReturnType<typeof useGameState>['xpBreakdown']
  toggleHabit: ReturnType<typeof useGameState>['toggleHabit']
  setAttribute: ReturnType<typeof useGameState>['setAttribute']
  updateDailyField: ReturnType<typeof useGameState>['updateDailyField']
  completeDay: () => Promise<CompleteDayResult | null>
}) {
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const { showToast } = useToast()

  const handleComplete = async () => {
    setCompleting(true)
    const result = await completeDay()
    setCompleting(false)

    if (!result) return

    setJustCompleted(true)

    // XP toast
    showToast({
      type: 'xp',
      title: `+${result.xpEarned} XP Earned`,
      subtitle: `Day complete! Streak: ${result.newStreak} days`,
      xp: result.xpEarned,
    })

    // Perfect day toast
    if (result.isPerfectDay) {
      setTimeout(() => showToast({
        type: 'perfect',
        title: 'Perfect Day!',
        subtitle: 'All 7 habits completed — +30 bonus XP',
        icon: '⭐',
      }), 600)
    }

    // Level up toast
    if (result.newLevel > result.oldLevel) {
      setTimeout(() => showToast({
        type: 'levelup',
        title: `Level Up! Level ${result.newLevel}`,
        subtitle: getLevelTitle(result.newLevel),
        icon: '🎖️',
      }), 1200)
    }

    // Phoenix toast
    if (result.phoenixActivated) {
      setTimeout(() => showToast({
        type: 'phoenix',
        title: 'Phoenix Rising!',
        subtitle: '2x XP multiplier for 3 days — welcome back!',
        icon: '🔥',
      }), 1800)
    }

    // Achievement toasts
    result.achievements.forEach((a, i) => {
      setTimeout(() => showToast({
        type: 'achievement',
        title: a.name,
        subtitle: 'Achievement Unlocked!',
        icon: a.icon,
        xp: a.xp,
      }), 2400 + i * 600)
    })
  }

  return (
    <>
      {/* Habits */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Habits
          <span className="ml-2 stat-number" style={{ color: 'var(--accent-gold)' }}>
            +{xpBreakdown.habits + xpBreakdown.perfectDay} XP
          </span>
        </h2>
        <div className="space-y-3">
          {HABITS.map((habit, i) => {
            const key = HABIT_KEYS[i]
            const checked = !!dailyLog.habits[key]
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: checked ? 'var(--text-muted)' : undefined, textDecoration: checked ? 'line-through' : 'none' }}>
                  {habit}
                </span>
                <button
                  className="habit-toggle"
                  data-checked={checked.toString()}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleHabit(key)}
                >
                  {checked && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Attributes — larger 44px touch targets */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Attributes (1-5)
          <span className="ml-2 stat-number" style={{ color: 'var(--accent-gold)' }}>
            +{xpBreakdown.attributes + xpBreakdown.allAttributes} XP
          </span>
        </h2>
        <div className="space-y-3">
          {ATTRIBUTES.map((attr, i) => {
            const key = ATTRIBUTE_KEYS[i]
            const value = dailyLog.attributes[key] || 0
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{attr}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAttribute(key, n)}
                      className="w-10 h-10 rounded-md text-sm font-bold transition-colors"
                      style={{
                        background: value >= n ? 'var(--accent-cyan)' : 'var(--bg-hover)',
                        color: value >= n ? '#fff' : 'var(--text-muted)',
                        border: value >= n ? 'none' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Fields */}
      <div className="card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Extras
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>MRR ($)</label>
            <input
              type="number"
              value={dailyLog.mrr ?? ''}
              onChange={(e) => updateDailyField('mrr', e.target.value ? Number(e.target.value) : null)}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Diet Score (1-5)</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => updateDailyField('diet_score', n)}
                  className="w-10 h-10 rounded-md text-sm font-bold"
                  style={{
                    background: (dailyLog.diet_score || 0) >= n ? 'var(--accent-green)' : 'var(--bg-hover)',
                    color: (dailyLog.diet_score || 0) >= n ? '#fff' : 'var(--text-muted)',
                    border: (dailyLog.diet_score || 0) >= n ? 'none' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Win of the Day</label>
          <input
            type="text"
            value={dailyLog.win_of_day ?? ''}
            onChange={(e) => updateDailyField('win_of_day', e.target.value || null)}
            placeholder="What was your biggest win today?"
            className="input"
          />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Niyyah (Intention)</label>
          <input
            type="text"
            value={dailyLog.niyyah ?? ''}
            onChange={(e) => updateDailyField('niyyah', e.target.value || null)}
            placeholder="Today I intend to..."
            className="input"
          />
        </div>
      </div>

      {/* Complete Day */}
      <AnimatePresence mode="wait">
        {!dailyLog.completed && !justCompleted && (
          <motion.button
            key="complete-btn"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="btn btn-gold w-full text-lg py-4"
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? 'Saving...' : `Complete Day (+${xpBreakdown.total} XP)`}
          </motion.button>
        )}
        {(dailyLog.completed || justCompleted) && (
          <motion.div
            key="complete-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="card text-center celebration-card"
            style={{ borderColor: 'var(--accent-green)', borderWidth: '1px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
              className="text-4xl mb-2"
            >
              ✨
            </motion.div>
            <p className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>
              Day Complete!
            </p>
            <p className="stat-number text-sm mt-1" style={{ color: 'var(--text-gold)' }}>
              +{dailyLog.xp_earned || xpBreakdown.total} XP earned
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================
// PRAYERS TAB
// ============================================================
function PrayersTab({
  prayerLog,
  nonNegotiablesMet,
  togglePrayer,
}: {
  prayerLog: ReturnType<typeof useGameState>['prayerLog']
  nonNegotiablesMet: ReturnType<typeof useGameState>['nonNegotiablesMet']
  togglePrayer: ReturnType<typeof useGameState>['togglePrayer']
}) {
  // Group prayers by time
  const times = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const
  const grouped = times.map((time) => ({
    time,
    prayers: PRAYERS.filter((p) => p.time === time),
  }))

  return (
    <>
      {/* Non-negotiable status */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Non-Negotiables
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span style={{ color: nonNegotiablesMet.fajr ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {nonNegotiablesMet.fajr ? '✓' : '✗'}
            </span>
            <span className="text-sm">Fajr</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: nonNegotiablesMet.secondPrayer ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {nonNegotiablesMet.secondPrayer ? '✓' : '✗'}
            </span>
            <span className="text-sm">Maghrib / Isha</span>
          </div>
        </div>
      </div>

      {/* Prayer Grid */}
      {grouped.map(({ time, prayers }) => (
        <div key={time} className="card">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>
            {time}
            {(time === 'Fajr' || time === 'Maghrib' || time === 'Isha') && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>
                non-negotiable
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {prayers.map((prayer) => {
              const checked = !!prayerLog.prayers[prayer.key]
              return (
                <div key={prayer.key} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">{prayer.name}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      {prayer.rakahs}r
                    </span>
                  </div>
                  <button
                    className="habit-toggle"
                    style={{ width: '36px', height: '36px' }}
                    data-checked={checked.toString()}
                    onClick={() => togglePrayer(prayer.key)}
                  >
                    {checked && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

// ============================================================
// LIFTS TAB
// ============================================================
function LiftsTab() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const [selectedSplit, setSelectedSplit] = useState(0)
  const [sets, setSets] = useState<Record<string, { weight: number; reps: number }[]>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prMessage, setPrMessage] = useState<string | null>(null)
  const [liftError, setLiftError] = useState<string | null>(null)

  const session = WORKOUT_SPLIT[selectedSplit]
  const exercises = [...session.exercises, ...ABS_EXERCISES]

  const addSet = (exerciseName: string) => {
    const current = sets[exerciseName] || []
    const lastSet = current[current.length - 1]
    setSets({
      ...sets,
      [exerciseName]: [...current, { weight: lastSet?.weight || 0, reps: lastSet?.reps || 0 }],
    })
  }

  const updateSet = (exerciseName: string, index: number, field: 'weight' | 'reps', value: number) => {
    const current = [...(sets[exerciseName] || [])]
    current[index] = { ...current[index], [field]: value }
    setSets({ ...sets, [exerciseName]: current })
  }

  const removeSet = (exerciseName: string, index: number) => {
    const current = [...(sets[exerciseName] || [])]
    current.splice(index, 1)
    setSets({ ...sets, [exerciseName]: current })
  }

  const saveSets = async () => {
    setSaving(true)
    setPrMessage(null)
    setLiftError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setSaving(false); return }

      // Query max weights for PR detection
      const exerciseNames = Object.keys(sets)
      const { data: prData } = await supabase
        .from('lift_sets')
        .select('exercise, weight')
        .eq('user_id', user.id)
        .in('exercise', exerciseNames)
        .order('weight', { ascending: false })

      const prMap: Record<string, number> = {}
      for (const row of prData || []) {
        if (!prMap[row.exercise] || row.weight > prMap[row.exercise]) {
          prMap[row.exercise] = row.weight
        }
      }

      const prs: string[] = []
      const rows = Object.entries(sets).flatMap(([exercise, exerciseSets]) =>
        exerciseSets.map((s, i) => {
          const isPR = s.weight > 0 && s.weight > (prMap[exercise] || 0)
          if (isPR) prs.push(`${exercise}: ${s.weight}lbs`)
          return {
            user_id: user.id,
            date: today,
            session_type: session.name,
            exercise,
            set_number: i + 1,
            weight: s.weight,
            reps: s.reps,
            rpe: null,
            is_pr: isPR,
            notes: null,
          }
        })
      )

      if (rows.length > 0) {
        const { error } = await supabase.from('lift_sets').insert(rows)
        if (error) throw error
      }

      if (prs.length > 0) {
        setPrMessage(`PR! ${prs.join(', ')}`)
      }

      setSaved(true)
    } catch (err) {
      setLiftError(err instanceof Error ? err.message : 'Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Split selector */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Workout Split
        </h2>
        <div className="flex gap-2 flex-wrap">
          {WORKOUT_SPLIT.map((split, i) => (
            <button
              key={split.name}
              onClick={() => { setSelectedSplit(i); setSets({}); setSaved(false) }}
              className="px-3 py-2 rounded-md text-xs font-medium"
              style={{
                background: selectedSplit === i ? 'var(--accent-cyan)' : 'var(--bg-hover)',
                color: selectedSplit === i ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {split.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((exercise) => {
        const exerciseSets = sets[exercise.name] || []
        return (
          <div key={exercise.name} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{exercise.name}</h3>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Target: {exercise.targetWeight > 0 ? `${exercise.targetWeight}lb` : '—'} × {exercise.targetReps} × {exercise.sets}
              </span>
            </div>
            {exerciseSets.map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-xs w-6" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                <input
                  type="number"
                  value={s.weight || ''}
                  onChange={(e) => updateSet(exercise.name, i, 'weight', Number(e.target.value))}
                  placeholder="lbs"
                  className="input input-sm w-20"
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>×</span>
                <input
                  type="number"
                  value={s.reps || ''}
                  onChange={(e) => updateSet(exercise.name, i, 'reps', Number(e.target.value))}
                  placeholder="reps"
                  className="input input-sm w-16"
                />
                <button
                  onClick={() => removeSet(exercise.name, i)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: 'var(--accent-red)', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addSet(exercise.name)}
              className="text-xs px-3 py-1.5 rounded-md"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
            >
              + Add Set
            </button>
          </div>
        )
      })}

      {liftError && (
        <p className="text-sm text-center" style={{ color: 'var(--accent-red)' }}>{liftError}</p>
      )}
      {Object.keys(sets).length > 0 && !saved && (
        <button className="btn btn-primary w-full" onClick={saveSets} disabled={saving}>
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      )}
      {saved && (
        <div className="card text-center" style={{ borderColor: 'var(--accent-green)' }}>
          <p className="font-bold" style={{ color: 'var(--accent-green)' }}>Workout Saved!</p>
          {prMessage && (
            <p className="text-sm mt-1" style={{ color: 'var(--accent-gold)' }}>{prMessage}</p>
          )}
        </div>
      )}
    </>
  )
}

// ============================================================
// BODY TAB
// ============================================================
function BodyTab({
  bodyComp,
  saveBodyComp,
}: {
  bodyComp: ReturnType<typeof useGameState>['bodyComp']
  saveBodyComp: ReturnType<typeof useGameState>['saveBodyComp']
}) {
  const [amWeight, setAmWeight] = useState<string>(bodyComp?.am_weight?.toString() || '')
  const [pmWeight, setPmWeight] = useState<string>(bodyComp?.pm_weight?.toString() || '')
  const [bodyFat, setBodyFat] = useState<string>(bodyComp?.body_fat?.toString() || '')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaveError(null)
    try {
      await saveBodyComp({
        am_weight: amWeight ? Number(amWeight) : null,
        pm_weight: pmWeight ? Number(pmWeight) : null,
        body_fat: bodyFat ? Number(bodyFat) : null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        Body Composition
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>AM Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            value={amWeight}
            onChange={(e) => setAmWeight(e.target.value)}
            placeholder="0.0"
            className="input input-sm"
          />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>PM Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            value={pmWeight}
            onChange={(e) => setPmWeight(e.target.value)}
            placeholder="0.0"
            className="input input-sm"
          />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Body Fat %</label>
          <input
            type="number"
            step="0.1"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="0.0"
            className="input input-sm"
          />
        </div>
      </div>
      {saveError && (
        <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{saveError}</p>
      )}
      <button className="btn btn-primary w-full" onClick={handleSave}>
        {saved ? 'Saved!' : 'Save Body Comp'}
      </button>
    </div>
  )
}

// ============================================================
// NUTRITION TAB
// ============================================================
interface FoodEntry {
  id: string
  meal_label: string | null
  food_name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
}

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

function NutritionTab() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [meal, setMeal] = useState('Lunch')
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [saving, setSaving] = useState(false)
  const [entryError, setEntryError] = useState<string | null>(null)

  // Fetch today's entries
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoaded(true); return }
      const { data } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: true })
      if (data) setEntries(data)
      setLoaded(true)
    })()
  }, [today])

  const addEntry = async () => {
    if (!foodName.trim()) return
    setSaving(true)
    setEntryError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { data, error } = await supabase.from('food_logs').insert({
      user_id: user.id,
      date: today,
      meal_label: meal,
      food_name: foodName.trim(),
      calories: calories ? Number(calories) : null,
      protein: protein ? Number(protein) : null,
      carbs: carbs ? Number(carbs) : null,
      fat: fat ? Number(fat) : null,
    }).select().single()

    if (error) {
      setEntryError(error.message)
    } else if (data) {
      setEntries((prev) => [...prev, data])
    }
    setFoodName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setSaving(false)
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('food_logs').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // Macro totals
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fat: acc.fat + (e.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <>
      {/* Daily Macro Summary */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Daily Macros
        </h2>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="stat-number text-lg font-bold" style={{ color: totals.calories > CUT.DAILY_CALORIES ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {totals.calories}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {CUT.DAILY_CALORIES} cal</div>
          </div>
          <div>
            <div className="stat-number text-lg font-bold" style={{ color: totals.protein >= CUT.PROTEIN_G ? 'var(--accent-green)' : 'var(--text-primary)' }}>
              {Math.round(totals.protein)}g
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {CUT.PROTEIN_G}g pro</div>
          </div>
          <div>
            <div className="stat-number text-lg font-bold">{Math.round(totals.carbs)}g</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {CUT.CARBS_G}g carbs</div>
          </div>
          <div>
            <div className="stat-number text-lg font-bold">{Math.round(totals.fat)}g</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {CUT.FAT_G}g fat</div>
          </div>
        </div>
      </div>

      {/* Add Food Form */}
      <div className="card space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Log Food
        </h3>
        <div className="flex gap-2 flex-wrap">
          {MEALS.map((m) => (
            <button
              key={m}
              onClick={() => setMeal(m)}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: meal === m ? 'var(--accent-cyan)' : 'var(--bg-hover)',
                color: meal === m ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Food name"
          className="w-full px-3 py-2 rounded-md text-sm"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <div className="grid grid-cols-4 gap-2">
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Cal" className="input input-sm" />
          <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Pro g" className="input input-sm" />
          <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carb g" className="input input-sm" />
          <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat g" className="input input-sm" />
        </div>
        {entryError && (
          <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{entryError}</p>
        )}
        <button className="btn btn-primary w-full" onClick={addEntry} disabled={saving}>
          {saving ? 'Adding...' : 'Add Food'}
        </button>
      </div>

      {/* Today's Entries */}
      <div className="card">
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Today&apos;s Log
        </h3>
        {entries.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No food logged today.</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: 'var(--bg-primary)' }}
              >
                <div>
                  <div className="text-sm font-medium">{entry.food_name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {entry.meal_label} — {entry.calories || 0} cal, {entry.protein || 0}g P, {entry.carbs || 0}g C, {entry.fat || 0}g F
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-xs px-2 py-1"
                  style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
