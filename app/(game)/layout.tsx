import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <main className="main-content lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
