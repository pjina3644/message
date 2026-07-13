import { AuthProvider } from '../components/AuthProvider'
import '../index.css'

export const metadata = {
  title: 'message - 실시간 채팅 웹앱',
  description: 'Vite에서 Next.js로 마이그레이션된 실시간 메신저 앱',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 text-ink-body m-0 p-0 h-screen w-screen overflow-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
