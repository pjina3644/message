import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { friends, getChatById, messagesByChat } from '../data/dummy'
import Avatar from '../components/Avatar'
import { ChevronLeft, Search, Menu, Plus, Send } from '../components/Icons'

// 발신자 id -> 표시 이름 (그룹방에서 상대 이름 표기용)
function senderName(senderId) {
  const f = friends.find((u) => u.id === senderId)
  return f ? f.username : '알 수 없음'
}

// 시스템 메시지(날짜 구분선 등) — pill, #F0F0F0 / #999
function SystemPill({ children }) {
  return (
    <div className="flex justify-center py-1">
      <span className="rounded-full bg-fill px-3 py-1 text-xs text-ink-light">
        {children}
      </span>
    </div>
  )
}

function ChatRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chat = getChatById(id)

  const [messages, setMessages] = useState(messagesByChat[id] || [])
  const [draft, setDraft] = useState('')

  if (!chat) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-ink">존재하지 않는 채팅방입니다.</p>
        <button
          onClick={() => navigate('/app/chats')}
          className="mt-4 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-body active:bg-surface"
        >
          채팅 목록으로
        </button>
      </div>
    )
  }

  // 1단계에서는 로컬 state에만 추가 (3단계에서 Supabase insert + Realtime으로 교체)
  function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, senderId: 'me', text, time: '방금' },
    ])
    setDraft('')
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
        <h1 className="flex-1 truncate text-[18px] font-semibold text-ink">
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
        <SystemPill>2026년 6월 8일</SystemPill>

        {messages.map((m, i) => {
          const mine = m.senderId === 'me'
          const prev = messages[i - 1]
          const next = messages[i + 1]
          // 연속 같은 발신자: 첫 메시지에만 아바타/이름, 마지막(같은 시각)에만 타임스탬프
          const firstOfRun = !prev || prev.senderId !== m.senderId
          const lastOfRun =
            !next || next.senderId !== m.senderId || next.time !== m.time

          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? 'items-end' : 'items-start'} ${
                firstOfRun ? 'mt-2' : ''
              }`}
            >
              {isGroup && !mine && firstOfRun && (
                <span className="mb-1 ml-11 text-xs text-ink-sub">
                  {senderName(m.senderId)}
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
                    <Avatar name={senderName(m.senderId)} size="sm" />
                  ) : (
                    <span className="w-9 shrink-0" />
                  ))}

                <div
                  className={`animate-bubble max-w-[16rem] px-3 py-2 text-sm leading-relaxed break-words ${
                    mine
                      ? 'rounded-[18px_4px_18px_18px] bg-kakao text-ink-body'
                      : 'rounded-[4px_18px_18px_18px] border border-line bg-white text-ink-body'
                  }`}
                >
                  {m.text}
                </div>

                {lastOfRun && (
                  <span className="mb-0.5 shrink-0 text-[11px] text-ink-light">
                    {m.time}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </main>

      {/* 입력창 (Chat Input — #F0F0F0, 20px radius) */}
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
          className="min-w-0 flex-1 rounded-[20px] bg-fill px-4 py-2 text-[15px] text-ink placeholder:text-ink-hint outline-none"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="보내기"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
            canSend
              ? 'bg-kakao text-ink-body'
              : 'bg-fill text-ink-hint'
          }`}
        >
          <Send size={18} />
        </button>
      </form>

      <p className="shrink-0 bg-surface px-3 py-1.5 text-center text-[11px] text-ink-light">
        1단계 데모 — 입력은 로컬에만 저장돼요 (3단계에서 실시간 동기화)
      </p>
    </div>
  )
}

export default ChatRoom
