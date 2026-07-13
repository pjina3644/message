'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { Search, Plus } from '../components/Icons'

function formatChatTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? '오후' : '오전'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${ampm} ${hours}:${minutes}`
  } else if (diffDays === 1) {
    return '어제'
  } else {
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`
    } else {
      return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`
    }
  }
}

function ChatList() {
  const router = useRouter()
  const [chatList, setChatList] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchChats() {
    if (!isSupabaseConfigured) {
      // Fallback dummy data
      setChatList([
        {
          chat_id: 'c1',
          type: 'direct',
          name: '김하늘',
          last_message: '내일 시간 괜찮아?',
          last_time: new Date().toISOString(),
          unread_count: 2,
        },
      ])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.rpc('get_my_chats')
      if (error) throw error
      setChatList(data || [])
    } catch (err) {
      console.error('채팅 목록 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 린트 경고 방지를 위해 마이크로태스크 큐로 연기하여 비동기 실행
    Promise.resolve().then(() => {
      fetchChats()
    })

    if (!isSupabaseConfigured) return

    // 실시간 메시지 변경 감지하여 채팅방 목록 자동 새로고침
    const channel = supabase
      .channel('chat-list-realtime')
      .on(
        'postgres_changes',
        { event: 'insert', schema: 'public', table: 'messages' },
        () => {
          fetchChats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-muted bg-white">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="pb-2 bg-white min-h-full">
      <header className="flex h-14 items-center justify-between px-4">
        <h1 className="text-[22px] font-bold text-ink">채팅</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-sub transition-colors active:bg-surface"
          >
            <Search size={22} />
          </button>
          <button
            type="button"
            onClick={() => router.push('/app/chats/new')}
            aria-label="새 채팅"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-sub transition-colors active:bg-surface"
          >
            <Plus size={22} />
          </button>
        </div>
      </header>

      {chatList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <p className="text-sm text-ink-muted">아직 참여 중인 채팅방이 없습니다.</p>
          <p className="text-xs text-ink-light mt-1">친구 탭에서 대화를 시작해 보세요!</p>
        </div>
      ) : (
        <ul>
          {chatList.map((chat) => (
            <li key={chat.chat_id}>
              <Link
                href={`/app/chats/${chat.chat_id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-surface cursor-pointer"
              >
                <Avatar name={chat.name || '알 수 없음'} url={chat.avatar_url} group={chat.type === 'group'} size="md" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{chat.name || '알 수 없음'}</p>
                      {chat.type === 'group' && chat.member_count > 0 && (
                        <span className="text-xs text-ink-light font-normal shrink-0">
                          {chat.member_count}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-ink-light">
                      {formatChatTime(chat.last_time)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-ink-muted mt-0.5">
                    {chat.last_message || ''}
                  </p>
                </div>

                {chat.unread_count > 0 && (
                  <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold leading-none text-white">
                    {chat.unread_count > 99 ? '99+' : chat.unread_count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatList
