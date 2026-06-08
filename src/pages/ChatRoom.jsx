import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  currentUser,
  friends,
  getChatById,
  messagesByChat,
} from '../data/dummy'

// 발신자 id -> 표시 이름 (그룹방에서 상대 이름 표기용)
function senderName(senderId) {
  const f = friends.find((u) => u.id === senderId)
  return f ? f.username : '알 수 없음'
}

function ChatRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chat = getChatById(id)

  const [messages, setMessages] = useState(messagesByChat[id] || [])
  const [draft, setDraft] = useState('')

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        존재하지 않는 채팅방입니다.
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

  return (
    <div className="flex h-full flex-col bg-[#b2c7d9]">
      {/* 헤더 */}
      <header className="flex items-center gap-2 px-3 py-3">
        <button
          onClick={() => navigate('/chats')}
          className="px-1 text-xl text-gray-700"
          aria-label="뒤로"
        >
          ←
        </button>
        <h1 className="font-semibold text-gray-800">{chat.name}</h1>
      </header>

      {/* 메시지 목록 */}
      <main className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
        {messages.map((m) => {
          const mine = m.senderId === 'me'
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
            >
              {isGroup && !mine && (
                <span className="mb-0.5 ml-1 text-xs text-gray-600">
                  {senderName(m.senderId)}
                </span>
              )}
              <div className="flex items-end gap-1.5">
                {mine && <span className="text-[10px] text-gray-500">{m.time}</span>}
                <div
                  className={`max-w-[15rem] rounded-2xl px-3 py-2 text-sm break-words ${
                    mine ? 'bg-[#fef01b] text-gray-900' : 'bg-white text-gray-900'
                  }`}
                >
                  {m.text}
                </div>
                {!mine && <span className="text-[10px] text-gray-500">{m.time}</span>}
              </div>
            </div>
          )
        })}
      </main>

      {/* 입력창 */}
      <form onSubmit={handleSend} className="flex items-center gap-2 bg-white px-3 py-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지 입력"
          className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[#fef01b] px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-40"
          disabled={!draft.trim()}
        >
          전송
        </button>
      </form>

      <p className="bg-yellow-50 px-3 py-1 text-center text-[11px] text-yellow-700">
        1단계 데모 — 입력은 로컬에만 저장됩니다 (3단계에서 실시간 동기화)
      </p>
    </div>
  )
}

export default ChatRoom
