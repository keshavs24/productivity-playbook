'use client'

import { useGameState } from '@/hooks/useGameState'
import { ATTRIBUTES, ATTRIBUTE_KEYS } from '@/lib/config'
import { getLevelXP } from '@/lib/game/levels'

export default function CharacterPage() {
  const {
    loading,
    character,
    dailyLog,
    level,
    levelTitle,
    levelProgress,
    xpToNext,
    nextLevelXP,
    streakMultiplier,
  } = useGameState()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-56 w-full" />
        <div className="skeleton h-40 w-full" />
      </div>
    )
  }

  const totalXP = character?.total_xp || 0
  const streak = character?.current_streak || 0
  const longestStreak = character?.longest_streak || 0
  const freezes = character?.streak_freezes || 2

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Character Sheet
      </h1>

      {/* Character Card */}
      <div
        className="card p-6 text-center"
        style={{ borderColor: 'var(--accent-gold)', borderWidth: '1px' }}
      >
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: character?.phoenix_active ? 'rgba(249, 115, 22, 0.2)' : 'var(--bg-hover)',
            border: `3px solid ${character?.phoenix_active ? 'var(--accent-orange)' : 'var(--accent-gold)'}`,
          }}
        >
          <span className="text-3xl">{character?.phoenix_active ? '🔥' : '⚔️'}</span>
        </div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {character?.name || 'Warrior'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-gold)' }}>
          Level {level} — {levelTitle}
        </p>
        {character?.phoenix_active && (
          <p className="text-xs mt-1" style={{ color: 'var(--accent-orange)' }}>
            Phoenix Active — 2x XP ({character.phoenix_days}d left)
          </p>
        )}

        {/* XP Bar */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="progress-bar progress-xp" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: `${(levelProgress * 100).toFixed(1)}%` }} />
          </div>
          <p className="stat-number text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {totalXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            <span className="ml-2">({xpToNext.toLocaleString()} to next)</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Today&apos;s Attributes
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ATTRIBUTES.map((attr, i) => {
            const key = ATTRIBUTE_KEYS[i]
            const value = dailyLog.attributes[key]
            return (
              <div
                key={key}
                className="p-3 rounded-lg text-center"
                style={{ background: 'var(--bg-primary)' }}
              >
                <div className="stat-number text-lg font-bold" style={{ color: value ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {value || '—'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{attr}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Streaks */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Streak Info
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="stat-number text-xl font-bold" style={{ color: streak > 0 ? 'var(--accent-green)' : undefined }}>
              {streak}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current</div>
          </div>
          <div className="text-center">
            <div className="stat-number text-xl font-bold">{longestStreak}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Longest</div>
          </div>
          <div className="text-center">
            <div className="stat-number text-xl font-bold" style={{ color: 'var(--accent-cyan)' }}>
              {freezes}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Freezes</div>
          </div>
        </div>
        <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Multiplier: </span>
          <span className="stat-number text-sm font-bold" style={{ color: 'var(--text-gold)' }}>
            {streakMultiplier}x
          </span>
        </div>
      </div>

      {/* Achievements placeholder */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Achievements
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          50 badges to unlock. Complete daily habits, hit milestones, and build streaks to earn them.
        </p>
      </div>
    </div>
  )
}
