import { NavLink } from 'react-router-dom'
import { User, MessageCircle, Menu } from './Icons'
import { chats } from '../data/dummy'

const tabs = [
  { to: '/app', label: '친구', Icon: User, end: true },
  { to: '/app/chats', label: '채팅', Icon: MessageCircle },
  { to: '/app/more', label: '더보기', Icon: Menu },
]

// 안 읽은 메시지 합계 — 채팅 탭 배지
const totalUnread = chats.reduce((sum, c) => sum + (c.unread || 0), 0)

function BottomNav() {
  return (
    <nav className="flex border-t border-line bg-white">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `relative flex h-14 flex-1 flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              isActive ? 'text-ink-body' : 'text-ink-light'
            }`
          }
        >
          <span className="relative">
            <Icon size={24} />
            {to === '/app/chats' && totalUnread > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
