'use client'

import BottomNav from '../../../components/BottomNav'

export default function MainLayout({ children }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
