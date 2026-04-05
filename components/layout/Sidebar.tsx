'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGameState } from '@/hooks/useGameState'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', shortcut: '1' },
  { href: '/work', label: 'Revenue Hours', shortcut: '2' },
  { href: '/track', label: 'Daily Tracking', shortcut: '3' },
  { href: '/plan', label: 'Goals & Plans', shortcut: '4' },
  { href: '/character', label: 'Character', shortcut: '5' },
  { href: '/review', label: 'Review', shortcut: '6' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { level, levelTitle, levelProgress, character, nextLevelXP } = useGameState()
  const totalXP = character?.total_xp || 0
  const streak = character?.current_streak || 0

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-dvh fixed left-0 top-0"
      style={{
        background: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Brand */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent-gold)' }}
          >
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <path
                d="M20 44V28l12-8 12 8v16"
                stroke="#000"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2
              className="text-sm font-bold leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Playbook
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Level up your life
            </p>
          </div>
        </div>
      </div>

      {/* Character Mini Card */}
      <div
        className="mx-4 mb-4 p-3 rounded-lg"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-gold)' }}>
            LVL {level} — {levelTitle}
          </span>
          <span className="stat-number text-xs" style={{ color: 'var(--text-gold)' }}>
            {totalXP.toLocaleString()} XP
          </span>
        </div>
        <div className="progress-bar progress-xp">
          <div className="progress-bar-fill" style={{ width: `${(levelProgress * 100).toFixed(1)}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {streak}-day streak
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {totalXP.toLocaleString()}/{nextLevelXP.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline"
              style={{
                background: isActive ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <span>{item.label}</span>
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {item.shortcut}
              </kbd>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          v2.0
        </div>
      </div>
    </aside>
  )
}
