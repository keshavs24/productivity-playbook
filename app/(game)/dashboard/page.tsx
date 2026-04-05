'use client'

import { useGameState } from '@/hooks/useGameState'
import { HABITS, HABIT_KEYS, REVENUE_HOURS_TARGET } from '@/lib/config'
import { getWisdom } from '@/lib/game/wisdom'

export default function DashboardPage() {
  const {
    loading,
    character,
    dailyLog,
    xpBreakdown,
    level,
    levelTitle,
    levelProgress,
    xpToNext,
    currentLevelXP,
    nextLevelXP,
    streakMultiplier,
    totalRevenueHours,
    totalRevenueMinutes,
    nonNegotiablesMet,
    toggleHabit,
  } = useGameState()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  const totalXP = character?.total_xp || 0
  const streak = character?.current_streak || 0
  const revenueProgress = Math.min((totalRevenueHours / REVENUE_HOURS_TARGET) * 100, 100)
  const revenueH = Math.floor(totalRevenueHours)
  const revenueM = Math.round((totalRevenueHours - revenueH) * 60)

  return (
    <div className="space-y-6">
      {/* Player Card */}
      <div
        className="card p-6"
        style={{ borderColor: 'var(--accent-gold)', borderWidth: '1px' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Productivity Playbook
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="stat-number text-2xl font-bold" style={{ color: 'var(--text-gold)' }}>
              {totalXP.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Total XP
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-gold)' }}>LVL {level} — {levelTitle}</span>
            <span className="stat-number" style={{ color: 'var(--text-muted)' }}>
              {totalXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <div className="progress-bar progress-xp" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: `${(levelProgress * 100).toFixed(1)}%` }} />
          </div>
        </div>

        {/* Streak + Multiplier */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)' }}>Streak:</span>
            <span className="stat-number font-bold">{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)' }}>Multiplier:</span>
            <span className="stat-number font-bold" style={{ color: 'var(--text-gold)' }}>
              {streakMultiplier}x
            </span>
          </div>
          {character?.phoenix_active && (
            <div className="flex items-center gap-1">
              <span style={{ color: 'var(--accent-orange)' }}>Phoenix 2x</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ({character.phoenix_days}d left)
              </span>
            </div>
          )}
        </div>

        {/* Today's XP preview */}
        {xpBreakdown.subtotal > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Today so far: </span>
            <span className="stat-number text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
              +{xpBreakdown.total} XP
            </span>
          </div>
        )}
      </div>

      {/* Non-Negotiables Status */}
      <div className="card">
        <h2
          className="text-sm font-bold mb-3 uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Non-Negotiables
        </h2>
        <div className="space-y-3">
          {[
            { name: '6h Revenue Work', done: nonNegotiablesMet.revenue },
            { name: 'Fajr Prayer', done: nonNegotiablesMet.fajr },
            { name: 'Maghrib / Isha Prayer', done: nonNegotiablesMet.secondPrayer },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: item.done ? 'var(--accent-green)' : 'var(--bg-hover)',
                  border: item.done ? 'none' : '2px solid var(--border-medium)',
                }}
              >
                {item.done && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: item.done ? 'var(--accent-green)' : undefined }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Hours Today */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Revenue Hours
          </h2>
          <span className="stat-number text-lg font-bold" style={{ color: 'var(--accent-cyan)' }}>
            {revenueH}h {revenueM}m
          </span>
        </div>
        <div className="progress-bar progress-revenue" style={{ height: '10px' }}>
          <div className="progress-bar-fill" style={{ width: `${revenueProgress}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{revenueH}h {revenueM}m</span>
          <span>{REVENUE_HOURS_TARGET}h target</span>
        </div>
      </div>

      {/* Today's Habits */}
      <div className="card">
        <h2
          className="text-sm font-bold mb-3 uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Today&apos;s Habits
        </h2>
        <div className="space-y-2">
          {HABITS.map((habit, i) => {
            const key = HABIT_KEYS[i]
            const checked = !!dailyLog.habits[key]
            return (
              <div key={key} className="flex items-center gap-3">
                <button
                  className="habit-toggle"
                  data-checked={checked.toString()}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onClick={() => toggleHabit(key)}
                >
                  {checked && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <span className="text-sm" style={{ textDecoration: checked ? 'line-through' : 'none', color: checked ? 'var(--text-muted)' : undefined }}>
                  {habit}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wisdom Quote */}
      <WisdomCard />
    </div>
  )
}

function WisdomCard() {
  const wisdom = getWisdom('positive')
  return (
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
  )
}
