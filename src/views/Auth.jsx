'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { MessageCircle } from '../components/Icons'

function Auth() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    if (!supabase) {
      setErrorMsg('Supabase 설정이 올바르지 않습니다. .env 파일을 확인해 주세요.')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        // 회원가입
        if (!username.trim()) {
          setErrorMsg('닉네임을 입력해 주세요.')
          setLoading(false)
          return
        }
        
        // Supabase Auth 회원가입 진행
        // 이메일 가입 시 options.data.username에 닉네임을 저장해,
        // trigger 함수인 handle_new_user가 profiles 테이블을 채울 때 이를 가져올 수 있게 하거나,
        // 또는 기본적으로 handle_new_user는 email의 id 부분을 username으로 넣습니다.
        // 여기서는 user_metadata에 username을 실어 보냅니다.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        })

        if (error) throw error

        // 이메일 확인 활성화 여부에 따라 세션이 즉시 생기거나 대기할 수 있음
        if (data.session) {
          // 회원가입 직후 로그인됨 -> profiles 테이블을 추가로 수동 보정 (만약 트리거가 split_part만 썼을 경우 닉네임을 반영)
          await supabase
            .from('profiles')
            .update({ username: username.trim() })
            .eq('id', data.user.id)
          
          router.push('/app')
        } else {
          setSuccessMsg('회원가입 메일이 발송되었습니다. 메일함을 확인해 주세요! (또는 바로 로그인해 보세요)')
          // 메일 인증 확인 메일이 활성화된 경우 대기 필요
        }
      } else {
        // 로그인
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/app')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || '인증 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-white px-6 py-10 justify-between">
      {/* 뒤로 가기 / 헤더 */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex h-9 items-center gap-1 text-sm font-semibold text-ink-sub active:text-ink"
        >
          &larr; 랜딩페이지로
        </Link>
      </div>

      {/* 중앙 브랜드 및 양식 */}
      <div className="my-auto flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kakao text-kakao-ink shadow-sm">
            <MessageCircle size={36} />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {isSignUp ? '새로운 시작' : '다시 대화하기'}
          </h1>
          <p className="text-xs text-ink-muted">
            {isSignUp
              ? '이메일과 비밀번호로 간편하게 가입해 보세요'
              : '로그인 후 실시간 대화를 시작하세요'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-ink-sub">
                닉네임
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="카카오에서 보일 닉네임"
                className="w-full rounded-xl bg-surface border border-line px-4 py-3 text-[15px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-ink-sub">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl bg-surface border border-line px-4 py-3 text-[15px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-ink-sub">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자리 이상 비밀번호"
              minLength={6}
              className="w-full rounded-xl bg-surface border border-line px-4 py-3 text-[15px] outline-none focus:border-kakao-ink focus:ring-1 focus:ring-kakao-ink transition-all"
            />
          </div>

          {/* 에러 및 성공 메시지 */}
          {errorMsg && (
            <div className="rounded-xl bg-danger/10 p-3 text-xs font-semibold text-danger">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-xl bg-success/10 p-3 text-xs font-semibold text-success">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl border-2 border-kakao-ink bg-kakao-marketing py-3.5 text-base font-bold text-kakao-ink transition hover:brightness-95 active:brightness-90 disabled:opacity-50"
          >
            {loading ? '처리 중...' : isSignUp ? '가입 완료' : '로그인'}
          </button>
        </form>
      </div>

      {/* 하단 탭 전환 */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setErrorMsg('')
            setSuccessMsg('')
          }}
          className="text-sm font-semibold text-ink-muted hover:text-ink active:underline"
        >
          {isSignUp
            ? '이미 계정이 있으신가요? 로그인하기'
            : '처음이신가요? 이메일 회원가입하기'}
        </button>
      </div>
    </div>
  )
}

export default Auth
