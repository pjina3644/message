'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { ChevronLeft } from '../components/Icons'

function NewChat() {
  const router = useRouter()
  
  const [friendsList, setFriendsList] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchFriends() {
      if (!isSupabaseConfigured) {
        setFriendsList([
          { id: 'u1', username: '김하늘', avatar_url: '' },
          { id: 'u2', username: '이준호', avatar_url: '' },
          { id: 'u3', username: '박서연', avatar_url: '' },
        ])
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('username', { ascending: true })

        if (error) throw error
        setFriendsList(profiles || [])
      } catch (err) {
        console.error('친구 목록 조회 실패:', err)
        setErrorMsg('친구 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // 선택된 친구들의 이름 배열 구하기
  const getSelectedUsernames = () => {
    return friendsList
      .filter((f) => selectedIds.includes(f.id))
      .map((f) => f.username)
  }

  const handleCreateChat = async () => {
    if (selectedIds.length === 0) return
    
    setErrorMsg('')
    setCreating(true)

    try {
      if (!isSupabaseConfigured) {
        router.push('/app/chats/c1')
        return
      }

      if (selectedIds.length === 1) {
        // 1:1 대화방 개설
        const { data: chatId, error } = await supabase.rpc('get_or_create_direct_chat', {
          _friend_id: selectedIds[0],
        })
        if (error) throw error
        router.push(`/app/chats/${chatId}`)
      } else {
        // 그룹 대화방 개설
        const defaultName = getSelectedUsernames().join(', ')
        const finalName = groupName.trim() || defaultName
        
        const { data: chatId, error } = await supabase.rpc('create_group_chat', {
          _name: finalName,
          _user_ids: selectedIds,
        })
        if (error) throw error
        router.push(`/app/chats/${chatId}`)
      }
    } catch (err) {
      console.error('채팅방 생성 오류:', err)
      setErrorMsg('채팅방 생성에 실패했습니다.')
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-muted bg-white">
        로딩 중...
      </div>
    )
  }

  const isGroup = selectedIds.length >= 2

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-subtle px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/app/chats')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-body active:bg-surface"
            aria-label="뒤로"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold text-ink">
            {isGroup ? '그룹 채팅 만들기' : '새로운 채팅'}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleCreateChat}
          disabled={selectedIds.length === 0 || creating}
          className="rounded-xl bg-kakao-marketing border border-kakao-ink px-4 py-1.5 text-xs font-bold text-kakao-ink transition hover:brightness-95 disabled:opacity-50"
        >
          {creating ? '생성 중' : '확인'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-4">
        {/* 그룹 채팅방 이름 입력 (2인 이상 선택 시 표시) */}
        {isGroup && (
          <div className="border-b border-line-subtle p-4 bg-surface/30">
            <label htmlFor="groupName" className="text-xs font-bold text-ink-sub block mb-1.5">
              그룹 채팅방 이름 (선택)
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={getSelectedUsernames().join(', ')}
              maxLength={40}
              className="w-full rounded-xl bg-white border border-line px-4 py-2.5 text-[14px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
            />
          </div>
        )}

        {/* 에러 피드백 */}
        {errorMsg && (
          <div className="mx-4 mt-4 rounded-xl bg-danger/10 p-3 text-xs font-semibold text-danger">
            {errorMsg}
          </div>
        )}

        {/* 친구 목록 리스트 */}
        <p className="px-4 py-3 text-xs text-ink-light font-medium">대화 상대 선택</p>
        
        {friendsList.length === 0 ? (
          <div className="text-center py-10 px-6 text-sm text-ink-muted">
            대화할 수 있는 다른 친구가 없습니다.
          </div>
        ) : (
          <ul>
            {friendsList.map((f) => {
              const isSelected = selectedIds.includes(f.id)
              return (
                <li
                  key={f.id}
                  onClick={() => handleToggleSelect(f.id)}
                  className="flex h-16 items-center justify-between px-4 transition-colors active:bg-surface cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={f.username} url={f.avatar_url} size="md" />
                    <span className="font-medium text-ink truncate">{f.username}</span>
                  </div>

                  {/* 라운드 체크박스 */}
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-kakao border-kakao-ink text-kakao-ink'
                        : 'border-line bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}

export default NewChat
