import { Link } from 'react-router-dom'
import { chats } from '../data/dummy'

function ChatList() {
  return (
    <div>
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">채팅</h1>
      </header>

      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/chats/${chat.id}`}
              className="flex items-center gap-3 px-5 py-3 active:bg-gray-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                {chat.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-semibold text-gray-900">
                    {chat.name}
                  </p>
                  <span className="shrink-0 text-xs text-gray-400">
                    {chat.lastTime}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-500">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unread > 0 && (
                <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {chat.unread}
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
