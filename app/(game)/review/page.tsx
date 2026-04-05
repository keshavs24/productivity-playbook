'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { HABITS, HABIT_KEYS, REVENUE_HOURS_TARGET } from '@/lib/config'
import { getWisdom } from '@/lib/game/wisdom'
import { createClient } from '@/lib/supabase/client'

interface WeekStats {
  totalXP: number
  avgHabits: number
  totalRevenue: number
  daysCompleted: number
  nonNegDays: number
}

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export default function ReviewPage() {
  const supabase = createClient()
  const {
    loading,
    dailyLog,
    xpBreakdown,
    totalRevenueHours,
    nonNegotiablesMet,
  } = useGameState()

  const [weekStats, setWeekStats] = useState<WeekStats | null>(null)
  const [weeklyReview, setWeeklyReview] = useState<{ what_worked: string; what_didnt: string; next_focus: string } | null>(null)
  const [whatWorked, setWhatWorked] = useState('')
  const [whatDidnt, setWhatDidnt] = useState('')
  const [nextFocus, setNextFocus] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const weekStart = getWeekStart()

  const fetchWeekData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch this week's daily logs
    const today = new Date().toISOString().split('T')[0]
    const { data: logs } = await supabase
      .from('daily_logs')
      .select('xp_earned, habits, completed')
      .eq('user_id', user.id)
      .gte('date', weekStart)
      .lte('date', today)

    if (logs) {
      const totalXP = logs.reduce((s, l) => s + (l.xp_earned || 0), 0)
      const avgHabits = logs.length > 0
        ? logs.reduce((s, l) => s + Object.values(l.habits || {}).filter(Boolean).length, 0) / logs.length
        : 0
      const daysCompleted = logs.filter((l) => l.completed).length

      // Fetch revenue blocks this week
      const { data: blocks } = await supabase
        .from('revenue_blocks')
        .select('duration_min')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', today)

      const totalRevenue = (blocks || []).reduce((s, b) => s + (b.duration_min || 0), 0) / 60

      setWeekStats({ totalXP, avgHabits, totalRevenue, daysCompleted, nonNegDays: daysCompleted })
    }

    // Check for existing weekly review
    const { data: review } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .single()

    if (review) {
      setWeeklyReview(review)
      setWhatWorked(review.what_worked || '')
      setWhatDidnt(review.what_didnt || '')
      setNextFocus(review.next_focus || '')
    }
  }, [weekStart])

  useEffect(() => { fetchWeekData() }, [fetchWeekData])

  const saveWeeklyReview = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase.from('weekly_reviews').upsert({
      user_id: user.id,
      week_start: weekStart,
      stats: weekStats,
      what_worked: whatWorked.trim() || null,
      what_didnt: whatDidnt.trim() || null,
      next_focus: nextFocus.trim() || null,
      bonus_xp: 50,
    }, { onConflict: 'user_id,week_start' })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-24 w-full" />
      </div>
    )
  }

  const habitsCompleted = HABIT_KEYS.filter((k) => dailyLog.habits[k]).length
  const wisdom = getWisdom('positive')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Review
      </h1>

      {/* End of Day Summary */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Today&apos;s Summary
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="stat-number text-2xl font-bold" style={{ color: 'var(--text-gold)' }}>
              {dailyLog.completed ? dailyLog.xp_earned : xpBreakdown.total}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>XP {dailyLog.completed ? 'Earned' : 'So Far'}</div>
          </div>
          <div>
            <div className="stat-number text-2xl font-bold">{habitsCompleted}/7</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Habits</div>
          </div>
          <div>
            <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-cyan)' }}>
              {Math.floor(totalRevenueHours)}h
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue</div>
          </div>
        </div>
      </div>

      {/* XP Breakdown */}
      {xpBreakdown.subtotal > 0 && (
        <div className="card">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            XP Breakdown
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Habits', value: xpBreakdown.habits },
              { label: 'Perfect Day', value: xpBreakdown.perfectDay },
              { label: 'Attributes', value: xpBreakdown.attributes + xpBreakdown.allAttributes },
              { label: 'Prayer', value: xpBreakdown.prayer },
              { label: 'Revenue Work', value: xpBreakdown.revenue },
              { label: 'MRR Log', value: xpBreakdown.mrr },
              { label: 'Weight Log', value: xpBreakdown.weight },
              { label: 'Win of Day', value: xpBreakdown.winOfDay },
              { label: 'Diet', value: xpBreakdown.diet },
              { label: 'Nutrition', value: xpBreakdown.nutrition },
              { label: 'Lifts', value: xpBreakdown.lifts },
              { label: 'Non-Negotiables', value: xpBreakdown.nonNegotiables },
            ]
              .filter((r) => r.value > 0)
              .map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span className="stat-number font-bold" style={{ color: 'var(--accent-gold)' }}>+{row.value}</span>
                </div>
              ))}
            <div className="pt-2 mt-2 flex justify-between text-sm" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span className="stat-number font-bold">{xpBreakdown.subtotal}</span>
            </div>
            {xpBreakdown.multiplier > 1 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Streak Multiplier</span>
                <span className="stat-number font-bold" style={{ color: 'var(--text-gold)' }}>x{xpBreakdown.multiplier}</span>
              </div>
            )}
            <div className="pt-2 mt-2 flex justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span className="font-bold">Total</span>
              <span className="stat-number text-lg font-bold" style={{ color: 'var(--text-gold)' }}>+{xpBreakdown.total} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Non-Negotiables */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Non-Negotiables
        </h2>
        <div className="space-y-2">
          {[
            { name: '6h Revenue Work', done: nonNegotiablesMet.revenue },
            { name: 'Fajr Prayer', done: nonNegotiablesMet.fajr },
            { name: 'Maghrib / Isha', done: nonNegotiablesMet.secondPrayer },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: item.done ? 'var(--accent-green)' : 'transparent',
                  border: item.done ? 'none' : '2px solid var(--border-medium)',
                }}
              >
                {item.done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: item.done ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
        {nonNegotiablesMet.all && (
          <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
              All non-negotiables met! Discipline Shield active.
            </span>
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      {weekStats && (
        <div className="card">
          <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            This Week (from {new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="stat-number text-lg font-bold" style={{ color: 'var(--text-gold)' }}>{weekStats.totalXP}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>XP</div>
            </div>
            <div>
              <div className="stat-number text-lg font-bold">{weekStats.avgHabits.toFixed(1)}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Habits</div>
            </div>
            <div>
              <div className="stat-number text-lg font-bold" style={{ color: 'var(--accent-cyan)' }}>{weekStats.totalRevenue.toFixed(1)}h</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue</div>
            </div>
            <div>
              <div className="stat-number text-lg font-bold" style={{ color: 'var(--accent-green)' }}>{weekStats.daysCompleted}/7</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Days</div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Review Form */}
      <div className="card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Weekly Review {saved && <span style={{ color: 'var(--accent-green)' }}>— Saved! +50 XP</span>}
        </h2>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>What worked this week?</label>
          <textarea
            value={whatWorked}
            onChange={(e) => setWhatWorked(e.target.value)}
            placeholder="Wins, breakthroughs, habits that stuck..."
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm resize-none"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>What didn&apos;t work?</label>
          <textarea
            value={whatDidnt}
            onChange={(e) => setWhatDidnt(e.target.value)}
            placeholder="Missed habits, wasted time, blockers..."
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm resize-none"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Next week&apos;s focus</label>
          <textarea
            value={nextFocus}
            onChange={(e) => setNextFocus(e.target.value)}
            placeholder="Top priority, key daily action, commitment..."
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm resize-none"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <button className="btn btn-primary w-full" onClick={saveWeeklyReview} disabled={saving}>
          {saving ? 'Saving...' : weeklyReview ? 'Update Weekly Review' : 'Save Weekly Review (+50 XP)'}
        </button>
      </div>

      {/* Wisdom */}
      <div
        className="card text-center"
        style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.15)' }}
      >
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;{wisdom.text}&rdquo;
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          — {wisdom.source}
        </p>
      </div>
    </div>
  )
}
