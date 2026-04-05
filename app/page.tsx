import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--accent-gold)' }}
          >
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
              <path
                d="M20 44V28l12-8 12 8v16"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 44v-8h8v8"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Productivity Playbook
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-lg mb-10">
          Level up your life
        </p>

        <Link
          href="/login"
          className="btn btn-primary text-base px-8 py-3 w-full block text-center no-underline"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
