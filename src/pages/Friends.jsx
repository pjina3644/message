import { currentUser, friends } from '../data/dummy'

function Avatar({ emoji, size = 'h-12 w-12 text-2xl' }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-2xl bg-gray-100`}
    >
      {emoji}
    </div>
  )
}

function Friends() {
  return (
    <div>
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">친구</h1>
      </header>

      {/* 내 프로필 */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Avatar emoji={currentUser.avatar} />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{currentUser.username}</p>
          <p className="truncate text-sm text-gray-500">
            {currentUser.statusMessage}
          </p>
        </div>
      </div>

      <div className="my-1 h-px bg-gray-100" />

      {/* 친구 목록 */}
      <p className="px-5 py-2 text-xs text-gray-400">친구 {friends.length}</p>
      <ul>
        {friends.map((f) => (
          <li
            key={f.id}
            className="flex items-center gap-3 px-5 py-2.5 active:bg-gray-50"
          >
            <Avatar emoji={f.avatar} size="h-11 w-11 text-xl" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{f.username}</p>
              {f.statusMessage && (
                <p className="truncate text-sm text-gray-400">
                  {f.statusMessage}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Friends
