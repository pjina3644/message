import { currentUser, friends } from '../data/dummy'
import Avatar from '../components/Avatar'
import { Search, Plus } from '../components/Icons'

// 화면 상단 공통 액션바 — 제목(Heading Large 22/700) + 우측 아이콘
function TopBar({ title, children }) {
  return (
    <header className="flex h-14 items-center justify-between px-4">
      <h1 className="text-[22px] font-bold text-ink">{title}</h1>
      <div className="flex items-center gap-1 text-ink-sub">{children}</div>
    </header>
  )
}

function IconButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:bg-surface"
    >
      {children}
    </button>
  )
}

function Friends() {
  return (
    <div className="pb-2">
      <TopBar title="친구">
        <IconButton label="검색">
          <Search size={22} />
        </IconButton>
        <IconButton label="친구 추가">
          <Plus size={22} />
        </IconButton>
      </TopBar>

      {/* 내 프로필 */}
      <div className="flex items-center gap-3 px-4 py-3 active:bg-surface">
        <Avatar name={currentUser.username} size="lg" />
        <div className="min-w-0">
          <p className="text-[18px] font-semibold text-ink">
            {currentUser.username}
          </p>
          <p className="truncate text-sm text-ink-muted">
            {currentUser.statusMessage}
          </p>
        </div>
      </div>

      <div className="my-1 h-px bg-line-subtle" />

      {/* 친구 목록 */}
      <p className="px-4 py-2 text-xs text-ink-light">친구 {friends.length}</p>
      <ul>
        {friends.map((f) => (
          <li
            key={f.id}
            className="flex h-16 items-center gap-3 px-4 transition-colors active:bg-surface"
          >
            <Avatar name={f.username} size="md" />
            <div className="min-w-0">
              <p className="font-medium text-ink">{f.username}</p>
              {f.statusMessage && (
                <p className="truncate text-sm text-ink-muted">
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
