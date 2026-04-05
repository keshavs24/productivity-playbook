export default function WorkPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Revenue Engine
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Track your revenue-generating hours. 6 hours minimum. No exceptions.
      </p>

      {/* Timer */}
      <div className="card text-center py-12">
        <div className="stat-number text-6xl font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
          00:00:00
        </div>
        <button className="btn btn-primary text-lg px-12 py-4">
          Start Working
        </button>
      </div>

      {/* Today's Progress */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Today&apos;s Progress
        </h2>
        <div className="progress-bar progress-revenue" style={{ height: '12px' }}>
          <div className="progress-bar-fill" style={{ width: '0%' }} />
        </div>
        <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          <span>0h 0m</span>
          <span>6h target</span>
        </div>
      </div>

      {/* Blocks List */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Work Blocks
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No blocks logged today. Start your first work session above.
        </p>
      </div>
    </div>
  )
}
