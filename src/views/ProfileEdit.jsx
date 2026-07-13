'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'
import { ChevronLeft } from '../components/Icons'

function ProfileEdit() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [username, setUsername] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfigured) {
        setCurrentUser({ id: 'me' })
        setUsername('나 (더미)')
        setStatusMessage('Supabase 미설정')
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (profile) {
          setCurrentUser(profile)
          setUsername(profile.username || '')
          setStatusMessage(profile.status_message || '')
          setAvatarUrl(profile.avatar_url || '')
        }
      } catch (err) {
        console.error('프로필 로드 오류:', err)
        setErrorMsg('프로필을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return

    setErrorMsg('')
    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar_${Date.now()}.${fileExt}`
      const filePath = `${currentUser.id}/${fileName}`

      // 1. Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      // 2. Public URL 획득
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl)
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err)
      setErrorMsg('이미지 업로드에 실패했습니다. (크기나 포맷을 확인하세요)')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!currentUser) return
    if (!username.trim()) {
      setErrorMsg('닉네임을 입력해 주세요.')
      return
    }

    setErrorMsg('')
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update({
            username: username.trim(),
            status_message: statusMessage.trim(),
            avatar_url: avatarUrl,
          })
          .eq('id', currentUser.id)

        if (error) throw error
      }
      
      // 저장 성공 시 설정 페이지로 돌아감
      router.push('/app/more')
    } catch (err) {
      console.error('프로필 저장 실패:', err)
      setErrorMsg('프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
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
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line-subtle px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/app/more')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-body active:bg-surface"
            aria-label="뒤로"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold text-ink">프로필 편집</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-xl bg-kakao-marketing border border-kakao-ink px-4 py-1.5 text-xs font-bold text-kakao-ink transition hover:brightness-95 disabled:opacity-50"
        >
          {saving ? '저장 중' : '완료'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSave} className="flex flex-col items-center gap-8">
          {/* 아바타 편집 영역 */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="relative overflow-hidden rounded-xl">
              <Avatar name={username || '나'} url={avatarUrl} size="xl" />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl text-xs text-white font-semibold">
                  업로드 중...
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <span className="text-[11px] text-white font-bold">편집</span>
              </div>
            </div>
            {/* 히든 파일 인풋 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* 에러 피드백 */}
          {errorMsg && (
            <div className="w-full rounded-xl bg-danger/10 p-3 text-xs font-semibold text-danger">
              {errorMsg}
            </div>
          )}

          {/* 필드 정보 입력 */}
          <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-bold text-ink-sub">
                닉네임
              </label>
              <input
                id="username"
                type="text"
                required
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
                className="w-full rounded-xl bg-surface border border-line px-4 py-3 text-[15px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-bold text-ink-sub">
                상태 메시지
              </label>
              <input
                id="status"
                type="text"
                maxLength={60}
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="상태메시지를 입력해 주세요"
                className="w-full rounded-xl bg-surface border border-line px-4 py-3 text-[15px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ProfileEdit
