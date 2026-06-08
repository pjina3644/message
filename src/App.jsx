import { isSupabaseConfigured } from './lib/supabase'

// 임시 더미 데이터 (3단계에서 Supabase 실시간 메시지로 교체)
const dummyMessages = [
  { id: 1, mine: false, text: '안녕하세요! 👋' },
  { id: 2, mine: true, text: '네 안녕하세요~' },
  { id: 3, mine: false, text: '카톡 스타일 채팅앱 만드는 중이에요' },
  { id: 4, mine: true, text: '오 좋네요 🎉' },
]

function App() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-100 p-4">
      {/* 채팅방 화면 (1단계 정적 UI 클론의 시작) */}
      <div className="flex h-[640px] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-[#b2c7d9] shadow-lg">
        {/* 헤더 */}
        <header className="flex items-center gap-2 bg-[#b2c7d9] px-4 py-3">
          <button className="text-xl">←</button>
          <h1 className="font-semibold text-gray-800">채팅방</h1>
        </header>

        {/* 메시지 목록 */}
        <main className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
          {dummyMessages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  m.mine
                    ? 'bg-[#fef01b] text-gray-900'
                    : 'bg-white text-gray-900'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </main>

        {/* 입력창 */}
        <footer className="flex items-center gap-2 bg-white px-3 py-2">
          <input
            type="text"
            placeholder="메시지 입력"
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
          />
          <button className="rounded-full bg-[#fef01b] px-4 py-2 text-sm font-medium">
            전송
          </button>
        </footer>

        {/* 연결 상태 배지 (개발용 — Supabase 연결 후 사라짐) */}
        <div
          className={`px-4 py-1 text-center text-xs ${
            isSupabaseConfigured
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isSupabaseConfigured
            ? 'Supabase 연결됨 ✅'
            : 'Supabase 미설정 — .env에 URL/anon key를 넣어주세요'}
        </div>
      </div>
    </div>
  )
}

export default App
