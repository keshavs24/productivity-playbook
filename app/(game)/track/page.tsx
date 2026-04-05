export default function TrackPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
        Daily Tracking
      </h1>

      {/* Tab Bar */}
      <div
        className="flex gap-1 p-1 rounded-lg overflow-x-auto"
        style={{ background: 'var(--bg-card)' }}
      >
        {['Habits', 'Nutrition', 'Lifts', 'Prayers', 'Body'].map((tab, i) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: i === 0 ? 'var(--bg-hover)' : 'transparent',
              color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Habits Tab Content */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Habits
        </h2>
        <div className="space-y-3">
          {[
            'Wake Before Fajr',
            'Prayers (2+)',
            'Workout',
            'Deep Work 4h+',
            'Ship Something',
            'Quran Reading',
            'Read 30 Min',
          ].map((habit) => (
            <div key={habit} className="flex items-center justify-between">
              <span className="text-sm">{habit}</span>
              <div className="habit-toggle" data-checked="false" role="checkbox" aria-checked="false" tabIndex={0} />
            </div>
          ))}
        </div>
      </div>

      {/* Attributes */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Attributes (1-5)
        </h2>
        <div className="space-y-3">
          {['Discipline', 'Focus', 'Confidence', 'Deen', 'Mental Toughness', 'Reliability'].map((attr) => (
            <div key={attr} className="flex items-center justify-between">
              <span className="text-sm">{attr}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="w-8 h-8 rounded-md text-xs font-bold transition-colors"
                    style={{
                      background: 'var(--bg-hover)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
