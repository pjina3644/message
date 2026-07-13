'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfigured) {
        setCurrentUser({ username: '나 (더미)', status_message: 'Supabase 미설정', avatar_url: '' })
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setCurrentUser(profile)
        } else {
          setCurrentUser({ username: user.email.split('@')[0], status_message: '' })
        }
      } catch (err) {
        console.error('더보기 프로필 조회 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleMenuClick = async (label) => {
    if (label === '프로필 편집') {
      router.push('/app/profile')
    } else if (label === '로그아웃') {
      if (window.confirm('로그아웃 하시겠습니까?')) {
        if (supabase) {
          await supabase.auth.signOut()
        }
        router.push('/')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-muted bg-white">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="pb-2 bg-white min-h-full">
      <header className="flex h-14 items-center px-4">
        <h1 className="text-[22px] font-bold text-ink">더보기</h1>
      </header>

      {/* 내 프로필 */}
      {currentUser && (
        <div className="flex items-center gap-3 px-4 py-3 active:bg-surface cursor-pointer" onClick={() => router.push('/app/profile')}>
          <Avatar name={currentUser.username || '나'} url={currentUser.avatar_url} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-semibold text-ink">
              {currentUser.username || '나'}
            </p>
            <p className="truncate text-sm text-ink-muted">
              {currentUser.status_message || ''}
            </p>
          </div>
        </div>
      )}

      <div className="my-1 h-px bg-line-subtle" />

      {/* 설정 메뉴 (정적) */}
      <ul>
        {menu.map(({ label, Icon, danger }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => handleMenuClick(label)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-surface cursor-pointer"
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
