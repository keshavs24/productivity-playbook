import { redirect } from 'next/navigation'

// Game root redirects to dashboard
export default function GameRoot() {
  redirect('/dashboard')
}
