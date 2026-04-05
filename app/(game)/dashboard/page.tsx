export default function DashboardPage() {
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
              0
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Total XP
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-gold)' }}>LVL 1 — Tawbah</span>
            <span className="stat-number" style={{ color: 'var(--text-muted)' }}>
              0 / 100 XP
            </span>
          </div>
          <div className="progress-bar progress-xp" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)' }}>Streak:</span>
            <span className="stat-number font-bold">0 days</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)' }}>Multiplier:</span>
            <span className="stat-number font-bold" style={{ color: 'var(--text-gold)' }}>
              1.0x
            </span>
          </div>
        </div>
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
            { name: '6h Revenue Work', done: false },
            { name: 'Fajr Prayer', done: false },
            { name: 'Maghrib / Isha Prayer', done: false },
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
              <span className="text-sm">{item.name}</span>
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
            0h 0m
          </span>
        </div>
        <div className="progress-bar progress-revenue" style={{ height: '10px' }}>
          <div className="progress-bar-fill" style={{ width: '0%' }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>0h</span>
          <span>6h target</span>
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
          {[
            'Wake Before Fajr',
            'Prayers (2+)',
            'Workout',
            'Deep Work 4h+',
            'Ship Something',
            'Quran Reading',
            'Read 30 Min',
          ].map((habit) => (
            <div key={habit} className="flex items-center gap-3">
              <div
                className="habit-toggle"
                data-checked="false"
                role="checkbox"
                aria-checked="false"
                tabIndex={0}
              >
                {/* Empty when unchecked */}
              </div>
              <span className="text-sm">{habit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wisdom Quote */}
      <div
        className="card text-center"
        style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.15)' }}
      >
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;The most beloved of deeds to Allah are those that are most consistent, even if they are small.&rdquo;
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          — Bukhari &amp; Muslim
        </p>
      </div>
    </div>
  )
}
