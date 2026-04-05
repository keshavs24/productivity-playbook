export default function CharacterPage() {
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
        {/* Avatar placeholder */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'var(--bg-hover)', border: '3px solid var(--accent-gold)' }}
        >
          <span className="text-3xl">⚔️</span>
        </div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Warrior
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-gold)' }}>
          Level 1 — Tawbah
        </p>

        {/* XP Bar */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="progress-bar progress-xp" style={{ height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: '0%' }} />
          </div>
          <p className="stat-number text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            0 / 100 XP
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="card">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Attributes (7-day average)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Discipline', value: '—' },
            { name: 'Focus', value: '—' },
            { name: 'Confidence', value: '—' },
            { name: 'Deen', value: '—' },
            { name: 'Mental Toughness', value: '—' },
            { name: 'Reliability', value: '—' },
          ].map((attr) => (
            <div
              key={attr.name}
              className="p-3 rounded-lg text-center"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="stat-number text-lg font-bold">{attr.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{attr.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Achievements
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          50 badges to unlock. Start tracking to earn your first.
        </p>
      </div>

      {/* Streaks */}
      <div className="card">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Streak Info
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="stat-number text-xl font-bold">0</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current</div>
          </div>
          <div className="text-center">
            <div className="stat-number text-xl font-bold">0</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Longest</div>
          </div>
          <div className="text-center">
            <div className="stat-number text-xl font-bold">2</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Freezes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
