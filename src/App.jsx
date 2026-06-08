import { Routes, Route } from 'react-router-dom'
import AppFrame from './components/AppFrame'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Friends from './pages/Friends'
import ChatList from './pages/ChatList'
import ChatRoom from './pages/ChatRoom'
import More from './pages/More'

function App() {
  return (
    <Routes>
      {/* 마케팅 랜딩 페이지 (전체화면) */}
      <Route path="/" element={<Landing />} />

      {/* 채팅 앱 — 데스크톱에서는 휴대폰 프레임 안에 표시 */}
      <Route path="/app" element={<AppFrame />}>
        {/* 하단 네비게이션이 있는 탭 화면 */}
        <Route element={<Layout />}>
          <Route index element={<Friends />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="more" element={<More />} />
        </Route>
        {/* 전체화면 채팅방 (네비 없음) */}
        <Route path="chats/:id" element={<ChatRoom />} />
      </Route>
    </Routes>
  )
}

export default App
