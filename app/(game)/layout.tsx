'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { ToastProvider } from '@/components/ui/GameToast'

const SHORTCUTS: Record<string, string> = {
  '1': '/dashboard',
  '2': '/work',
  '3': '/track',
  '4': '/plan',
  '5': '/character',
  '6': '/review',
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      const route = SHORTCUTS[e.key]
      if (route) {
        e.preventDefault()
        router.push(route)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return (
    <ToastProvider>
      <div className="min-h-dvh">
        <Sidebar />
        <main className="main-content lg:ml-64">
          <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
