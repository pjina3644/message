'use client'

import Landing from '../views/Landing'
import { useAuth } from '../components/AuthProvider'

export default function Home() {
  const { session } = useAuth()
  return <Landing session={session} />
}
