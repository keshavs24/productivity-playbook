'use client'

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#0a0a0f',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, sans-serif",
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📡</div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          marginBottom: '8px',
        }}
      >
        You&apos;re Offline
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '320px', lineHeight: 1.6 }}>
        No internet connection. Your progress is safe — reconnect to sync and continue your streak.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: '#06b6d4',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  )
}
