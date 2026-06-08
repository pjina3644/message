import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '친구', icon: '👤', end: true },
  { to: '/chats', label: '채팅', icon: '💬' },
  { to: '/more', label: '더보기', icon: '☰' },
]

function BottomNav() {
  return (
    <nav className="flex border-t border-gray-200 bg-white">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              isActive ? 'text-gray-900' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
