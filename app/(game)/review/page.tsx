export default function ReviewPage() {
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
            <div className="stat-number text-2xl font-bold" style={{ color: 'var(--text-gold)' }}>0</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>XP Earned</div>
          </div>
          <div>
            <div className="stat-number text-2xl font-bold">0/7</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Habits</div>
          </div>
          <div>
            <div className="stat-number text-2xl font-bold" style={{ color: 'var(--accent-cyan)' }}>0h</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue</div>
          </div>
        </div>
      </div>

      {/* Non-Negotiables */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Non-Negotiables
        </h2>
        <div className="space-y-2">
          {['6h Revenue Work', 'Fajr Prayer', 'Maghrib / Isha'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-lg">❌</span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
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
