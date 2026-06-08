import { Outlet } from 'react-router-dom'

// 앱(/app 하위) 전용 프레임 — 데스크톱에서는 가운데 정렬된 휴대폰 모양으로 표시.
// 랜딩 페이지(/)는 전체화면이라 이 프레임을 쓰지 않는다.
function AppFrame() {
  return (
    <div className="flex h-full justify-center bg-gray-200 sm:p-4">
      <div className="flex h-full w-full max-w-sm flex-col overflow-hidden bg-white sm:h-[760px] sm:rounded-3xl sm:shadow-xl">
        <Outlet />
      </div>
    </div>
  )
}

export default AppFrame
