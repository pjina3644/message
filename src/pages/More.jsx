import { useNavigate } from 'react-router-dom'
import { currentUser } from '../data/dummy'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { User, Bell, Moon, LogOut, ChevronRight } from '../components/Icons'

const menu = [
  { label: '프로필 편집', Icon: User },
  { label: '알림 설정', Icon: Bell },
  { label: '테마', Icon: Moon },
  { label: '로그아웃', Icon: LogOut, danger: true },
]

function More() {
  const navigate = useNavigate()

  const handleMenuClick = async (label) => {
    if (label === '로그아웃') {
      if (window.confirm('로그아웃 하시겠습니까?')) {
        if (supabase) {
          await supabase.auth.signOut()
        }
        navigate('/')
      }
    }
  }

  return (
    <div className="pb-2">
      <header className="flex h-14 items-center px-4">
        <h1 className="text-[22px] font-bold text-ink">더보기</h1>
      </header>

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

      {/* 설정 메뉴 (정적) */}
      <ul>
        {menu.map(({ label, Icon, danger }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => handleMenuClick(label)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-surface"
            >
              <Icon
                size={22}
                className={danger ? 'text-danger' : 'text-ink-sub'}
              />
              <span
                className={`flex-1 ${danger ? 'text-danger' : 'text-ink-body'}`}
              >
                {label}
              </span>
              {!danger && <ChevronRight size={20} className="text-ink-hint" />}
            </button>
          </li>
        ))}
      </ul>

      <div className="my-1 h-px bg-line-subtle" />

      {/* 개발용 연결 상태 */}
      <div className="px-4 py-4">
        <p className="mb-2 text-xs text-ink-light">개발 상태</p>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink-body">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              isSupabaseConfigured ? 'bg-success' : 'bg-kakao'
            }`}
          />
          {isSupabaseConfigured
            ? 'Supabase 연결됨'
            : 'Supabase 미설정 — .env에 URL / anon key 입력 필요'}
        </div>
      </div>
    </div>
  )
}

export default More
