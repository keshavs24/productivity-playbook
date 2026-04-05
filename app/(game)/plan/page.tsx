export default function PlanPage() {
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
          <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>0</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Active Goals</div>
        </div>
        <div className="card text-center py-4">
          <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>0</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Milestones Hit</div>
        </div>
      </div>

      {/* Goal Tree Placeholder */}
      <div
        className="card flex items-center justify-center"
        style={{ minHeight: '300px', borderStyle: 'dashed' }}
      >
        <div className="text-center">
          <p className="text-lg mb-2">Goal Tree</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            React Flow visualization coming soon
          </p>
          <button className="btn btn-primary mt-4">
            + Add First Goal
          </button>
        </div>
      </div>

      {/* Notes Placeholder */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Planning Notes
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Notion-style editor coming soon. Brain dump your strategy here.
        </p>
      </div>
    </div>
  )
}
