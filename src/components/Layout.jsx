import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

// 탭 화면(친구/채팅)용 공통 레이아웃 — 하단 네비게이션 포함.
// 채팅방(ChatRoom)은 전체화면이라 이 레이아웃을 쓰지 않는다.
function Layout() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default Layout
