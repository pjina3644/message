'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { Search, Plus } from '../components/Icons'

// 화면 상단 공통 액션바 — 제목(Heading Large 22/700) + 우측 아이콘
function TopBar({ title, children }) {
  return (
    <header className="flex h-14 items-center justify-between px-4">
      <h1 className="text-[22px] font-bold text-ink">{title}</h1>
      <div className="flex items-center gap-1 text-ink-sub">{children}</div>
    </header>
  )
}

function IconButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:bg-surface"
    >
      {children}
    </button>
  )
}

function Friends() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [friendsList, setFriendsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFriends() {
      if (!isSupabaseConfigured) {
        // Fallback for development without Supabase
        setCurrentUser({ id: 'me', username: '나 (더미)', statusMessage: 'Supabase가 설정되지 않았습니다.' })
        setFriendsList([
          { id: 'u1', username: '김하늘', statusMessage: '오늘도 화이팅' },
          { id: 'u2', username: '이준호', statusMessage: '' },
        ])
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. 내 프로필 정보 로드
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (myProfile) {
          setCurrentUser(myProfile)
        } else {
          setCurrentUser({ id: user.id, username: user.email.split('@')[0], statusMessage: '' })
        }

        // 2. 다른 유저 목록(친구 목록) 로드
        const { data: otherProfiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('username', { ascending: true })

        if (error) throw error
        setFriendsList(otherProfiles || [])
      } catch (err) {
        console.error('친구 목록 로딩 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFriends()
  }, [])

  const handleFriendClick = async (friendId) => {
    if (!isSupabaseConfigured) {
      router.push('/app/chats/c1')
      return
    }

    try {
      // 1:1 채팅방 생성 또는 기존 방 조회
      const { data: chatId, error } = await supabase.rpc('get_or_create_direct_chat', {
        _friend_id: friendId,
      })

      if (error) throw error
      if (chatId) {
        router.push(`/app/chats/${chatId}`)
      }
    } catch (err) {
      console.error('채팅방 생성 실패:', err)
      alert('채팅방을 여는 도중 오류가 발생했습니다.')
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
      <TopBar title="친구">
        <IconButton label="검색">
          <Search size={22} />
        </IconButton>
        <IconButton label="친구 추가">
          <Plus size={22} />
        </IconButton>
      </TopBar>

      {/* 내 프로필 */}
      {currentUser && (
        <div className="flex items-center gap-3 px-4 py-3 active:bg-surface transition-colors cursor-pointer" onClick={() => router.push('/app/profile')}>
          <Avatar name={currentUser.username} url={currentUser.avatar_url} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-semibold text-ink">
              {currentUser.username}
            </p>
            <p className="truncate text-sm text-ink-muted">
              {currentUser.status_message || currentUser.statusMessage || ''}
            </p>
          </div>
        </div>
      )}

      <div className="my-1 h-px bg-line-subtle" />

      {/* 친구 목록 */}
      <p className="px-4 py-2 text-xs text-ink-light">친구 {friendsList.length}</p>
      <ul>
        {friendsList.map((f) => (
          <li
            key={f.id}
            onClick={() => handleFriendClick(f.id)}
            className="flex h-16 items-center gap-3 px-4 transition-colors active:bg-surface cursor-pointer"
          >
            <Avatar name={f.username} url={f.avatar_url} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{f.username}</p>
              {f.status_message && (
                <p className="truncate text-sm text-ink-muted">
                  {f.status_message}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Friends
