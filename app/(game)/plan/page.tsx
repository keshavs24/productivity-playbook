'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Goal {
  id: string
  title: string
  target_value: number | null
  current_value: number
  deadline: string | null
  parent_id: string | null
  goal_type: string
  status: string
  lead_measure: string | null
  lag_measure: string | null
}

const GOAL_TYPES = [
  { value: 'goal', label: 'Goal' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'weekly_target', label: 'Weekly Target' },
  { value: 'daily_action', label: 'Daily Action' },
]

export default function PlanPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [goalType, setGoalType] = useState('goal')
  const [targetValue, setTargetValue] = useState('')
  const [deadline, setDeadline] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [leadMeasure, setLeadMeasure] = useState('')
  const [lagMeasure, setLagMeasure] = useState('')

  const fetchGoals = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (data) setGoals(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const resetForm = () => {
    setTitle('')
    setGoalType('goal')
    setTargetValue('')
    setDeadline('')
    setParentId(null)
    setLeadMeasure('')
    setLagMeasure('')
    setShowForm(false)
    setEditingId(null)
  }

  const [saveError, setSaveError] = useState<string | null>(null)

  const saveGoal = async () => {
    if (!title.trim()) return
    setSaveError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      title: title.trim(),
      goal_type: goalType,
      target_value: targetValue ? Number(targetValue) : null,
      deadline: deadline || null,
      parent_id: parentId,
      lead_measure: leadMeasure.trim() || null,
      lag_measure: lagMeasure.trim() || null,
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('goals').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('goals').insert(payload)
        if (error) throw error
      }
      resetForm()
      await fetchGoals()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save goal')
    }
  }

  const toggleStatus = async (goal: Goal) => {
    const newStatus = goal.status === 'completed' ? 'active' : 'completed'
    const { error } = await supabase.from('goals').update({ status: newStatus }).eq('id', goal.id)
    if (!error) await fetchGoals()
  }

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) await fetchGoals()
  }

  const editGoal = (goal: Goal) => {
    setEditingId(goal.id)
    setTitle(goal.title)
    setGoalType(goal.goal_type)
    setTargetValue(goal.target_value?.toString() || '')
    setDeadline(goal.deadline || '')
    setParentId(goal.parent_id)
    setLeadMeasure(goal.lead_measure || '')
    setLagMeasure(goal.lag_measure || '')
    setShowForm(true)
  }

  // Build tree structure
  const topLevel = goals.filter((g) => !g.parent_id)
  const getChildren = (parentId: string) => goals.filter((g) => g.parent_id === parentId)
  const activeCount = goals.filter((g) => g.status === 'active').length
  const completedCount = goals.filter((g) => g.status === 'completed').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Goals &amp; Plans
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Reverse-engineer your goals. Map the path from big vision to daily action.
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center py-4">
          <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>{activeCount}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Active Goals</div>
        </div>
        <div className="card text-center py-4">
          <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>{completedCount}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Completed</div>
        </div>
      </div>

      {/* Add Goal Button */}
      {!showForm && (
        <button className="btn btn-primary w-full" onClick={() => setShowForm(true)}>
          + Add Goal
        </button>
      )}

      {/* Goal Form */}
      {showForm && (
        <div className="card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            {editingId ? 'Edit Goal' : 'New Goal'}
          </h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title"
            className="w-full px-3 py-2 rounded-md text-sm"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              >
                {GOAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Target Value</label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 30000"
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Parent Goal</label>
              <select
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">None (top-level)</option>
                {goals.filter((g) => g.id !== editingId).map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Lead Measure</label>
              <input
                type="text"
                value={leadMeasure}
                onChange={(e) => setLeadMeasure(e.target.value)}
                placeholder="What you control"
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>Lag Measure</label>
              <input
                type="text"
                value={lagMeasure}
                onChange={(e) => setLagMeasure(e.target.value)}
                placeholder="Result you want"
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>
          {saveError && (
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{saveError}</p>
          )}
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={saveGoal}>
              {editingId ? 'Update' : 'Add Goal'}
            </button>
            <button className="btn btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {/* Goal Tree */}
      {goals.length === 0 ? (
        <div
          className="card flex items-center justify-center"
          style={{ minHeight: '200px', borderStyle: 'dashed' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No goals yet. Add your first goal to start reverse-engineering your vision.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {topLevel.map((goal) => (
            <GoalNode
              key={goal.id}
              goal={goal}
              depth={0}
              getChildren={getChildren}
              onToggle={toggleStatus}
              onEdit={editGoal}
              onDelete={deleteGoal}
              onAddChild={(id) => { setParentId(id); setShowForm(true) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GoalNode({
  goal,
  depth,
  getChildren,
  onToggle,
  onEdit,
  onDelete,
  onAddChild,
}: {
  goal: Goal
  depth: number
  getChildren: (id: string) => Goal[]
  onToggle: (g: Goal) => void
  onEdit: (g: Goal) => void
  onDelete: (id: string) => void
  onAddChild: (id: string) => void
}) {
  const children = getChildren(goal.id)
  const isComplete = goal.status === 'completed'
  const typeColor =
    goal.goal_type === 'goal' ? 'var(--accent-gold)' :
    goal.goal_type === 'milestone' ? 'var(--accent-cyan)' :
    goal.goal_type === 'weekly_target' ? 'var(--accent-green)' :
    'var(--text-muted)'

  const progress = goal.target_value
    ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100)
    : null

  return (
    <>
      <div
        className="card"
        style={{
          marginLeft: depth * 24,
          opacity: isComplete ? 0.6 : 1,
          borderLeftWidth: '3px',
          borderLeftColor: typeColor,
        }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(goal)}
            className="mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
            style={{
              background: isComplete ? 'var(--accent-green)' : 'transparent',
              border: isComplete ? 'none' : '2px solid var(--border-medium)',
              cursor: 'pointer',
            }}
          >
            {isComplete && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
                {goal.title}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${typeColor}20`, color: typeColor }}>
                {goal.goal_type}
              </span>
            </div>
            {(goal.lead_measure || goal.lag_measure) && (
              <div className="flex gap-4 mt-1">
                {goal.lead_measure && (
                  <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
                    Lead: {goal.lead_measure}
                  </span>
                )}
                {goal.lag_measure && (
                  <span className="text-xs" style={{ color: 'var(--accent-cyan)' }}>
                    Lag: {goal.lag_measure}
                  </span>
                )}
              </div>
            )}
            {progress !== null && (
              <div className="mt-2">
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs mt-0.5 inline-block" style={{ color: 'var(--text-muted)' }}>
                  {goal.current_value || 0} / {goal.target_value}
                </span>
              </div>
            )}
            {goal.deadline && (
              <span className="text-xs block mt-1" style={{ color: 'var(--text-muted)' }}>
                Due: {new Date(goal.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onAddChild(goal.id)}
              className="text-xs px-2 py-1 rounded"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
              title="Add sub-goal"
            >
              +
            </button>
            <button
              onClick={() => onEdit(goal)}
              className="text-xs px-2 py-1 rounded"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="text-xs px-2 py-1 rounded"
              style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      {children.map((child) => (
        <GoalNode
          key={child.id}
          goal={child}
          depth={depth + 1}
          getChildren={getChildren}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </>
  )
}
