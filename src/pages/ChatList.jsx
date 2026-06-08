import { Link } from 'react-router-dom'
import { chats } from '../data/dummy'
import Avatar from '../components/Avatar'
import { Search } from '../components/Icons'

function ChatList() {
  return (
    <div className="pb-2">
      <header className="flex h-14 items-center justify-between px-4">
        <h1 className="text-[22px] font-bold text-ink">채팅</h1>
        <button
          type="button"
          aria-label="검색"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-sub transition-colors active:bg-surface"
        >
          <Search size={22} />
        </button>
      </header>

      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/app/chats/${chat.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-surface"
            >
              <Avatar name={chat.name} group={chat.type === 'group'} size="md" />

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-semibold text-ink">{chat.name}</p>
                  <span className="shrink-0 text-xs text-ink-light">
                    {chat.lastTime}
                  </span>
                </div>
                <p className="truncate text-sm text-ink-muted">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unread > 0 && (
                <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold leading-none text-white">
                  {chat.unread > 99 ? '99+' : chat.unread}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList
