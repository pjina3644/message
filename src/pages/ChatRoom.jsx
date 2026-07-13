import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { ChevronLeft, Search, Menu, Plus, Send } from '../components/Icons'

function formatMessageTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? '오후' : '오전'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${ampm} ${hours}:${minutes}`
}

function formatSystemDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function ChatRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 1. 데이터 로드
  useEffect(() => {
    async function loadChatAndMessages() {
      if (!isSupabaseConfigured) {
        // Fallback for dummy data
        setChat({ id: 'c1', type: 'direct', name: '김하늘' })
        setMessages([
          { id: 'm1', sender_id: 'u1', content: '안녕! 잘 지내?', created_at: new Date(Date.now() - 60000 * 5).toISOString() },
          { id: 'm2', sender_id: 'me', content: '응 잘 지내~ 너는?', created_at: new Date(Date.now() - 60000 * 3).toISOString() },
        ])
        setCurrentUser({ id: 'me' })
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate('/auth')
          return
        }
        setCurrentUser(user)

        // (1) 채팅방 정보 조회
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('*')
          .eq('id', id)
          .single()

        if (chatError || !chatData) {
          console.error('채팅방 정보 조회 실패:', chatError)
          setChat(null)
          setLoading(false)
          return
        }

        // 1:1 방의 경우, 내 이름이 아닌 상대방 이름을 타이틀로 설정
        let chatName = chatData.name
        if (chatData.type === 'direct') {
          const { data: members } = await supabase
            .from('chat_members')
            .select(`
              user_id,
              profiles (
                username
              )
            `)
            .eq('chat_id', id)
            .neq('user_id', user.id)

          if (members && members.length > 0 && members[0].profiles) {
            chatName = members[0].profiles.username
          } else {
            chatName = '대화 상대 없음'
          }
        }

        setChat({
          ...chatData,
          name: chatName,
        })

        // (2) 과거 메시지 이력 조회
        const { data: msgsData, error: msgsError } = await supabase
          .from('messages')
          .select(`
            id,
            chat_id,
            sender_id,
            content,
            type,
            created_at,
            profiles (
              username
            )
          `)
          .eq('chat_id', id)
          .order('created_at', { ascending: true })

        if (msgsError) throw msgsError
        setMessages(msgsData || [])

        // (3) 내 읽음 정보 업데이트 (last_read_at)
        await supabase
          .from('chat_members')
          .update({ last_read_at: new Date().toISOString() })
          .eq('chat_id', id)
          .eq('user_id', user.id)

      } catch (err) {
        console.error('데이터 조회 오류:', err)
      } finally {
        setLoading(false)
      }
    }

    loadChatAndMessages()
  }, [id, navigate])

  // 2. 실시간 메시지 수신 구독
  useEffect(() => {
    if (!isSupabaseConfigured || !currentUser || !chat) return

    const channel = supabase
      .channel(`chat-room-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'insert',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${id}`,
        },
        async (payload) => {
          const newMsg = payload.new

          // 발신자 닉네임 가져오기
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', newMsg.sender_id)
            .single()

          const messageWithProfile = {
            ...newMsg,
            profiles: profile ? { username: profile.username } : null,
          }

          setMessages((prev) => {
            // 중복 수신 방지
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, messageWithProfile]
          })

          // 읽음 표시 자동 갱신
          await supabase
            .from('chat_members')
            .update({ last_read_at: new Date().toISOString() })
            .eq('chat_id', id)
            .eq('user_id', currentUser.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, currentUser, chat])

  // 3. 메시지 변경 시 스크롤 최하단 이동
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 4. 메시지 전송
  async function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !currentUser || !chat) return

    setDraft('') // 입력 필드 즉시 초기화

    try {
      const { error } = await supabase.from('messages').insert({
        chat_id: id,
        sender_id: currentUser.id,
        content: text,
        type: 'text',
      })
      if (error) throw error
    } catch (err) {
      console.error('메시지 전송 오류:', err)
      alert('메시지 전송에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-muted bg-white">
        로딩 중...
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-ink">존재하지 않거나 접근 권한이 없는 채팅방입니다.</p>
        <button
          onClick={() => navigate('/app/chats')}
          className="mt-4 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-body active:bg-surface"
        >
          채팅 목록으로
        </button>
      </div>
    )
  }

  const isGroup = chat.type === 'group'
  const canSend = draft.trim().length > 0

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line-subtle px-2">
        <button
          onClick={() => navigate('/app/chats')}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-body active:bg-surface"
          aria-label="뒤로"
        >
          <ChevronLeft size={24} />
        </button>
        <Avatar name={chat.name} group={isGroup} size="sm" />
        <h1 className="flex-1 truncate text-[18px] font-semibold text-ink ml-1">
          {chat.name}
        </h1>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-sub active:bg-surface"
          aria-label="검색"
        >
          <Search size={22} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-sub active:bg-surface"
          aria-label="메뉴"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* 메시지 목록 */}
      <main className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => {
          const mine = m.sender_id === currentUser?.id || m.senderId === 'me'
          const prev = messages[i - 1]
          const next = messages[i + 1]

          // 1. 날짜 구분선 필요 여부 (이전 메시지와 날짜가 다른 경우 또는 첫 메시지인 경우)
          const showDateDivider =
            !prev ||
            new Date(prev.created_at).toDateString() !==
              new Date(m.created_at).toDateString()

          // 2. 아바타/이름 노출: 연속 메시지 중 첫 메시지인 경우
          const firstOfRun = !prev || prev.sender_id !== m.sender_id || showDateDivider
          // 3. 시간 노출: 연속 메시지 중 마지막(또는 분 단위 시간 변화)인 경우
          const lastOfRun =
            !next ||
            next.sender_id !== m.sender_id ||
            formatMessageTime(next.created_at) !== formatMessageTime(m.created_at)

          const senderName = m.profiles?.username || '알 수 없음'

          return (
            <div key={m.id || i} className="flex flex-col">
              {showDateDivider && (
                <div className="flex justify-center py-2 mt-2">
                  <span className="rounded-full bg-fill px-3 py-1 text-xs text-ink-light">
                    {formatSystemDate(m.created_at)}
                  </span>
                </div>
              )}

              <div
                className={`flex flex-col ${
                  mine ? 'items-end' : 'items-start'
                } ${firstOfRun && !showDateDivider ? 'mt-2' : ''}`}
              >
                {isGroup && !mine && firstOfRun && (
                  <span className="mb-1 ml-11 text-xs text-ink-sub">
                    {senderName}
                  </span>
                )}

                <div
                  className={`flex items-end gap-1.5 ${
                    mine ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* 상대 아바타 (연속 메시지는 자리만 유지) */}
                  {!mine &&
                    (firstOfRun ? (
                      <Avatar name={senderName} size="sm" />
                    ) : (
                      <span className="w-9 shrink-0" />
                    ))}

                  <div
                    className={`animate-bubble max-w-[16rem] px-3 py-2 text-sm leading-relaxed break-words ${
                      mine
                        ? 'rounded-[18px_4px_18px_18px] bg-kakao text-ink-body shadow-sm'
                        : 'rounded-[4px_18px_18px_18px] border border-line bg-white text-ink-body shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>

                  {lastOfRun && (
                    <span className="mb-0.5 shrink-0 text-[11px] text-ink-light">
                      {formatMessageTime(m.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* 입력창 */}
      <form
        onSubmit={handleSend}
        className="flex shrink-0 items-end gap-2 border-t border-line-subtle bg-white px-3 py-2.5"
      >
        <button
          type="button"
          aria-label="첨부"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink-light active:bg-surface"
        >
          <Plus size={24} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지 입력"
          className="min-w-0 flex-1 rounded-[20px] bg-fill px-4 py-2 text-[15px] text-ink placeholder:text-ink-hint outline-none border border-transparent focus:bg-white focus:border-line transition-all"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="보내기"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
            canSend ? 'bg-kakao text-ink-body shadow-sm' : 'bg-fill text-ink-hint'
          }`}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
