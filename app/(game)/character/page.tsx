'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { ATTRIBUTES, ATTRIBUTE_KEYS } from '@/lib/config'
import { getLevelXP } from '@/lib/game/levels'
import { ACHIEVEMENTS, getAchievementCategories } from '@/lib/game/achievements'
import { createClient } from '@/lib/supabase/client'

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

      {/* Achievements */}
      <AchievementsGrid />
    </div>
  )
}

function AchievementsGrid() {
  const supabase = createClient()
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set())
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchUnlocked = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from('achievements')
        .select('key')
        .eq('user_id', user.id)
      if (error) throw error
      if (data) {
        setUnlockedKeys(new Set(data.map((a) => a.key)))
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load achievements')
    }
  }, [])

  useEffect(() => { fetchUnlocked() }, [fetchUnlocked])

  const categories = getAchievementCategories()
  const unlockedCount = unlockedKeys.size

  return (
    <div className="card">
      <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        Achievements ({unlockedCount}/{ACHIEVEMENTS.length})
      </h2>
      {fetchError && (
        <p className="text-sm mb-3" style={{ color: 'var(--accent-red)' }}>{fetchError}</p>
      )}
      {categories.map((cat) => {
        const badges = ACHIEVEMENTS.filter((a) => a.category === cat)
        const catUnlocked = badges.filter((a) => unlockedKeys.has(a.key)).length
        return (
          <div key={cat} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                {cat}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {catUnlocked}/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {badges.map((badge) => {
                const unlocked = unlockedKeys.has(badge.key)
                return (
                  <div
                    key={badge.key}
                    className="text-center p-2 rounded-lg"
                    style={{
                      background: unlocked ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-primary)',
                      opacity: unlocked ? 1 : 0.4,
                      border: unlocked ? '1px solid var(--accent-gold)' : '1px solid transparent',
                    }}
                    title={`${badge.name}: ${badge.description} (+${badge.xp} XP)`}
                  >
                    <div className="text-xl">{badge.icon}</div>
                    <div className="text-[10px] mt-1 leading-tight" style={{ color: 'var(--text-muted)' }}>
                      {badge.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
