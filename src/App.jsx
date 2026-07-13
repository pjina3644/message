import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import AppFrame from './components/AppFrame'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Friends from './pages/Friends'
import ChatList from './pages/ChatList'
import ChatRoom from './pages/ChatRoom'
import More from './pages/More'
import Auth from './pages/Auth'
import ProfileEdit from './pages/ProfileEdit'
import NewChat from './pages/NewChat'

function ProtectedRoute({ session, children }) {
  // Supabase가 설정되지 않았으면 개발 편의를 위해 통과시킴
  if (!isSupabaseConfigured) {
    return children
  }
  
  if (session === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-white text-sm text-ink-muted">
        로딩 중...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function App() {
  const [session, setSession] = useState(isSupabaseConfigured ? undefined : null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    // 1. 초기 세션 조회
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. 세션 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      {/* 마케팅 랜딩 페이지 (전체화면) */}
      <Route path="/" element={<Landing session={session} />} />

      {/* 로그인 / 회원가입 페이지 (세션이 있으면 바로 앱으로 리다이렉트) */}
      <Route
        path="/auth"
        element={
          isSupabaseConfigured && session ? (
            <Navigate to="/app" replace />
          ) : (
            <div className="flex h-full justify-center bg-surface sm:p-4">
              <div className="flex h-full w-full max-w-sm flex-col overflow-hidden bg-white sm:h-[760px] sm:rounded-3xl sm:shadow-[0_4px_24px_rgba(0,0,0,0.10)] sm:ring-1 sm:ring-line">
                <Auth />
              </div>
            </div>
          )
        }
      />

      {/* 채팅 앱 — 데스크톱에서는 휴대폰 프레임 안에 표시 */}
      <Route
        path="/app"
        element={
          <ProtectedRoute session={session}>
            <AppFrame />
          </ProtectedRoute>
        }
      >
        {/* 하단 네비게이션이 있는 탭 화면 */}
        <Route element={<Layout />}>
          <Route index element={<Friends />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="more" element={<More />} />
        </Route>
        {/* 전체화면 채팅방 (네비 없음) */}
        <Route path="chats/:id" element={<ChatRoom />} />
        {/* 프로필 편집 (네비 없음) */}
        <Route path="profile" element={<ProfileEdit />} />
        {/* 새 채팅 개설 (네비 없음) */}
        <Route path="chats/new" element={<NewChat />} />
      </Route>
    </Routes>
  )
}

export default App
