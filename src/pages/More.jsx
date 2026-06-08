import { currentUser } from '../data/dummy'
import { isSupabaseConfigured } from '../lib/supabase'

function More() {
  return (
    <div>
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">더보기</h1>
      </header>

      {/* 내 프로필 */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          {currentUser.avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{currentUser.username}</p>
          <p className="text-sm text-gray-500">{currentUser.statusMessage}</p>
        </div>
      </div>

      <div className="my-1 h-px bg-gray-100" />

      {/* 설정 메뉴 (정적) */}
      <ul className="text-gray-800">
        {['프로필 편집', '알림 설정', '테마', '로그아웃'].map((item) => (
          <li key={item} className="px-5 py-3 active:bg-gray-50">
            {item}
          </li>
        ))}
      </ul>

      <div className="my-1 h-px bg-gray-100" />

      {/* 개발용 연결 상태 */}
      <div className="px-5 py-4">
        <p className="mb-2 text-xs text-gray-400">개발 상태</p>
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isSupabaseConfigured
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isSupabaseConfigured
            ? 'Supabase 연결됨 ✅'
            : 'Supabase 미설정 — .env에 URL/anon key 입력 필요'}
        </div>
      </div>
    </div>
  )
}

export default More
