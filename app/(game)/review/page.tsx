'use client'

import { useGameState } from '@/hooks/useGameState'
import { HABITS, HABIT_KEYS, REVENUE_HOURS_TARGET } from '@/lib/config'

export default function ReviewPage() {
  const {
    loading,
    dailyLog,
    xpBreakdown,
    totalRevenueHours,
    nonNegotiablesMet,
  } = useGameState()

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
                <span className="stat-number font-bold" style={{ color: 'var(--text-gold)' }}>×{xpBreakdown.multiplier}</span>
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
              <span className="text-lg">{item.done ? '✅' : '❌'}</span>
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

      {/* Weekly Review */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Weekly Review
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Auto-generated every Monday with your week&apos;s stats, lead vs lag analysis, and muhasaba prompt.
        </p>
      </div>

      {/* Wisdom */}
      <div
        className="card text-center"
        style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.15)' }}
      >
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;Indeed, with hardship comes ease. Indeed, with hardship comes ease.&rdquo;
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          — Surah Ash-Sharh 94:5-6
        </p>
      </div>
    </div>
  )
}
