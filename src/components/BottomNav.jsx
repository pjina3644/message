'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MessageCircle, Menu } from './Icons'

function BottomNav() {
  const pathname = usePathname()

  const getLinkClass = (path) => {
    // Exact match for /app, or matches prefix /app/chats (but not chats/new)
    const isActive = path === '/app' ? pathname === '/app' : pathname.startsWith(path)
    
    return `flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'text-ink-body font-bold animate-bubble'
        : 'text-ink-light opacity-65 hover:opacity-90'
    }`
  }

  return (
    <nav className="flex h-[72px] shrink-0 border-t border-line-subtle bg-surface/90 backdrop-blur-md px-3 pb-safe-bottom">
      <Link href="/app" className={`flex-1 ${getLinkClass('/app')}`} aria-label="친구">
        <User size={22} />
        <span>친구</span>
      </Link>
      <Link href="/app/chats" className={`flex-1 ${getLinkClass('/app/chats')}`} aria-label="채팅">
        <MessageCircle size={22} />
        <span>채팅</span>
      </Link>
      <Link href="/app/more" className={`flex-1 ${getLinkClass('/app/more')}`} aria-label="더보기">
        <Menu size={22} />
        <span>더보기</span>
      </Link>
    </nav>
  )
}

export default BottomNav
