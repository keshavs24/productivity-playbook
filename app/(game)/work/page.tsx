'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { REVENUE_HOURS_TARGET, REVENUE_OVERTIME_MULTIPLIERS } from '@/lib/config'

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

const CATEGORIES = [
  { value: 'deep_work', label: 'Deep Work' },
  { value: 'sales', label: 'Sales' },
  { value: 'building', label: 'Building' },
  { value: 'admin', label: 'Admin' },
]

export default function WorkPage() {
  const { loading, revenueBlocks, totalRevenueMinutes, totalRevenueHours, addRevenueBlock, refresh } = useGameState()

  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('deep_work')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const startTimer = useCallback(() => {
    const now = new Date()
    setStartTime(now)
    setIsRunning(true)
    setElapsed(0)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setShowSaveForm(true)
  }, [])

  const saveBlock = async () => {
    if (!startTime) return
    const endTime = new Date()
    const durationMin = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

    await addRevenueBlock({
      date: today,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_min: durationMin,
      description: description.trim() || null,
      category,
      is_revenue: category !== 'admin',
    })

    setShowSaveForm(false)
    setDescription('')
    setCategory('deep_work')
    setElapsed(0)
    setStartTime(null)
    await refresh()
  }

  const discardBlock = () => {
    setShowSaveForm(false)
    setElapsed(0)
    setStartTime(null)
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const revenueProgress = Math.min((totalRevenueHours / REVENUE_HOURS_TARGET) * 100, 100)
  const revenueH = Math.floor(totalRevenueHours)
  const revenueM = Math.round((totalRevenueHours - revenueH) * 60)

  // Check overtime bonus
  let overtimeLabel = ''
  for (const tier of REVENUE_OVERTIME_MULTIPLIERS) {
    if (totalRevenueHours >= tier.hours) {
      overtimeLabel = `${tier.multiplier}x overtime bonus!`
      break
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Revenue Engine
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Track your revenue-generating hours. {REVENUE_HOURS_TARGET} hours minimum. No exceptions.
      </p>

      {/* Timer */}
      <div className="card text-center py-12">
        <div
          className="stat-number text-6xl font-bold mb-6"
          style={{ color: isRunning ? 'var(--accent-green)' : 'var(--accent-cyan)' }}
        >
          {formatTime(elapsed)}
        </div>

        {showSaveForm ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Session: {formatDuration(Math.round(elapsed / 60))}
            </p>
            <input
              type="text"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-center flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className="px-3 py-2 rounded-md text-xs font-medium transition-colors"
                  style={{
                    background: category === cat.value ? 'var(--accent-cyan)' : 'var(--bg-hover)',
                    color: category === cat.value ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-primary" onClick={saveBlock}>
                Save Block
              </button>
              <button className="btn btn-ghost" onClick={discardBlock}>
                Discard
              </button>
            </div>
          </div>
        ) : (
          <button
            className={`btn text-lg px-12 py-4 ${isRunning ? 'btn-ghost' : 'btn-primary'}`}
            onClick={isRunning ? stopTimer : startTimer}
            style={isRunning ? { borderColor: 'var(--accent-red)', color: 'var(--accent-red)' } : undefined}
          >
            {isRunning ? 'Stop' : 'Start Working'}
          </button>
        )}
      </div>

      {/* Today's Progress */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Today&apos;s Progress
        </h2>
        <div className="progress-bar progress-revenue" style={{ height: '12px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${revenueProgress}%`,
              background: revenueProgress >= 100
                ? 'linear-gradient(90deg, var(--accent-green-dim), var(--accent-green))'
                : undefined,
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          <span>{revenueH}h {revenueM}m</span>
          <span>{REVENUE_HOURS_TARGET}h target</span>
        </div>
        {overtimeLabel && (
          <p className="text-xs mt-2 text-center font-bold" style={{ color: 'var(--accent-gold)' }}>
            {overtimeLabel}
          </p>
        )}
      </div>

      {/* Blocks List */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Work Blocks
        </h2>
        {revenueBlocks.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No blocks logged today. Start your first work session above.
          </p>
        ) : (
          <div className="space-y-3">
            {revenueBlocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--bg-primary)' }}
              >
                <div>
                  <div className="text-sm font-medium">
                    {block.description || 'Work session'}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(block.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {block.end_time && ` — ${new Date(block.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="stat-number text-sm font-bold" style={{ color: 'var(--accent-cyan)' }}>
                    {block.duration_min ? formatDuration(block.duration_min) : '—'}
                  </div>
                  <div
                    className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block"
                    style={{
                      background: block.is_revenue ? 'rgba(6, 182, 212, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: block.is_revenue ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    }}
                  >
                    {block.category || 'work'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
