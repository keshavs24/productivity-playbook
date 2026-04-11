'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  type: 'achievement' | 'levelup' | 'perfect' | 'streak' | 'xp' | 'phoenix'
  title: string
  subtitle?: string
  icon?: string
  xp?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, toast.type === 'levelup' ? 5000 : 3500)
    return () => clearTimeout(timer)
  }, [onDone, toast.type])

  const colorMap = {
    achievement: 'var(--accent-gold)',
    levelup: 'var(--accent-purple)',
    perfect: 'var(--accent-green)',
    streak: 'var(--accent-orange)',
    xp: 'var(--accent-cyan)',
    phoenix: 'var(--accent-orange)',
  }

  const glowMap = {
    achievement: 'var(--shadow-glow-gold)',
    levelup: '0 0 30px rgba(168, 85, 247, 0.3)',
    perfect: 'var(--shadow-glow-green)',
    streak: '0 0 20px rgba(249, 115, 22, 0.2)',
    xp: 'var(--shadow-glow-cyan)',
    phoenix: '0 0 20px rgba(249, 115, 22, 0.3)',
  }

  const defaultIcons = {
    achievement: '🏆',
    levelup: '⬆️',
    perfect: '✨',
    streak: '🔥',
    xp: '💫',
    phoenix: '🔥',
  }

  const color = colorMap[toast.type]
  const glow = glowMap[toast.type]
  const icon = toast.icon || defaultIcons[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="toast-item"
      style={{
        borderColor: color,
        boxShadow: glow,
      }}
      onClick={onDone}
    >
      <span className="toast-icon">{icon}</span>
      <div className="toast-content">
        <span className="toast-title" style={{ color }}>{toast.title}</span>
        {toast.subtitle && (
          <span className="toast-subtitle">{toast.subtitle}</span>
        )}
      </div>
      {toast.xp && (
        <span className="toast-xp stat-number">+{toast.xp} XP</span>
      )}
    </motion.div>
  )
}
