import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Friends from './pages/Friends'
import ChatList from './pages/ChatList'
import ChatRoom from './pages/ChatRoom'
import More from './pages/More'

function App() {
  return (
    // 모바일 프레임: 데스크톱에서는 가운데 정렬된 휴대폰 모양으로 표시
    <div className="flex h-full justify-center bg-gray-200 sm:p-4">
      <div className="flex h-full w-full max-w-sm flex-col overflow-hidden bg-white sm:h-[760px] sm:rounded-3xl sm:shadow-xl">
        <Routes>
          {/* 하단 네비게이션이 있는 탭 화면 */}
          <Route element={<Layout />}>
            <Route path="/" element={<Friends />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/more" element={<More />} />
          </Route>
          {/* 전체화면 채팅방 (네비 없음) */}
          <Route path="/chats/:id" element={<ChatRoom />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
