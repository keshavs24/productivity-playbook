import type { Metadata, Viewport } from 'next'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

export const metadata: Metadata = {
  title: 'Productivity Playbook',
  description: 'Level up your life — gamified productivity, revenue tracking, goal mapping',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Playbook',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
