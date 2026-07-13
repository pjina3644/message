import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Zap,
  CheckCheck,
  Image,
  Search,
  Lock,
  ChevronLeft,
  Plus,
  Send,
  ArrowRight,
} from '../components/Icons'

const features = [
  {
    Icon: Zap,
    title: '실시간 메시지',
    desc: '보내는 즉시 도착. 새로고침이 필요 없는 Realtime 동기화로 대화가 끊기지 않아요.',
  },
  {
    Icon: MessageCircle,
    title: '1:1 & 그룹 채팅',
    desc: '둘만의 대화도, 여럿이 모인 단체방도. 원하는 사람과 자유롭게 방을 만들어요.',
  },
  {
    Icon: CheckCheck,
    title: '읽음 표시',
    desc: '상대가 읽었는지 한눈에. 안 읽은 메시지를 명확하게 보여줘요.',
  },
  {
    Icon: Image,
    title: '이미지 전송',
    desc: '사진을 대화 속에 바로 공유. 글로 다 못한 순간을 이미지로 전해요.',
  },
  {
    Icon: Search,
    title: '친구 찾기',
    desc: '닉네임으로 검색해 새로운 사람과 대화를 시작해요. 연결은 한 번의 클릭이면 충분해요.',
  },
  {
    Icon: Lock,
    title: '안전한 보안',
    desc: '행 단위 접근 제어(RLS)로 내 대화는 나와 상대만. 방 멤버가 아니면 볼 수 없어요.',
  },
]

const steps = [
  { no: '01', title: '가입하기', desc: '이메일 또는 구글 계정으로 30초 만에 시작.' },
  { no: '02', title: '친구 찾기', desc: '닉네임으로 검색해 대화 상대를 추가.' },
  { no: '03', title: '대화 시작', desc: '메시지를 보내면 실시간으로 바로 전달.' },
]

const stack = ['React', 'Vite', 'Tailwind CSS', 'Supabase']

// 브랜드 로고 — 옐로 라운드 스퀘어 + 워드마크
function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-kakao text-kakao-ink">
        <MessageCircle size={18} />
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        message
      </span>
    </Link>
  )
}

// 마케팅 필 — 보더드 옐로(2px solid 블랙, 16px radius)는 Kakao 시그니처 CTA
function MarketingPill({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-kakao-ink bg-kakao-marketing px-5 py-3 text-base font-bold text-kakao-ink transition hover:brightness-95 ${className}`}
    >
      {children}
    </Link>
  )
}

// 히어로 옆 휴대폰 목업 — 리디자인된 ChatRoom(흰 배경 + 옐로/화이트 말풍선) 축소 재현
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[300px]">
      {/* 뒤쪽 장식용 옐로 블롭 */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-kakao opacity-40 blur-2xl" />

      <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-kakao-ink bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center gap-2 border-b border-line-subtle px-3 pt-5 pb-3">
          <span className="text-ink-body">
            <ChevronLeft size={20} />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CFE7FF] text-xs font-semibold text-ink-body">
            김
          </span>
          <span className="text-sm font-semibold text-ink">김하늘</span>
        </div>

        {/* 메시지 */}
        <div className="flex flex-col gap-2 px-3 py-3" style={{ minHeight: 300 }}>
          <div className="flex justify-center">
            <span className="rounded-full bg-fill px-2.5 py-0.5 text-[10px] text-ink-light">
              2026년 6월 8일
            </span>
          </div>

          <div className="flex items-end gap-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#CFE7FF] text-[10px] font-semibold text-ink-body">
              김
            </span>
            <div className="max-w-[70%] rounded-[4px_16px_16px_16px] border border-line bg-white px-3 py-2 text-[13px] text-ink-body">
              안녕! 잘 지내?
            </div>
            <span className="text-[9px] text-ink-light">9:10</span>
          </div>

          <div className="flex items-end justify-end gap-1.5">
            <span className="text-[9px] text-ink-light">9:12</span>
            <div className="max-w-[70%] rounded-[16px_4px_16px_16px] bg-kakao px-3 py-2 text-[13px] text-ink-body">
              응 잘 지내~ 너는?
            </div>
          </div>

          <div className="flex items-end justify-end gap-1.5">
            <span className="text-[9px] text-ink-light">방금</span>
            <div className="max-w-[70%] rounded-[16px_4px_16px_16px] bg-kakao px-3 py-2 text-[13px] text-ink-body">
              내일 시간 괜찮아?
            </div>
          </div>
        </div>

        {/* 입력창 */}
        <div className="flex items-center gap-2 border-t border-line-subtle px-3 py-2.5">
          <span className="text-ink-light">
            <Plus size={20} />
          </span>
          <div className="flex-1 rounded-[16px] bg-fill px-3 py-1.5 text-[12px] text-ink-hint">
            메시지 입력
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-kakao text-ink-body">
            <Send size={15} />
          </span>
        </div>
      </div>
    </div>
  )
}

function Landing({ session }) {
  const startPath = session ? '/app' : '/auth'
  return (
    <div className="min-h-screen bg-white text-ink-body">
      {/* ───── 상단 네비게이션 ───── */}
      <header className="sticky top-0 z-20 border-b border-line-subtle bg-white/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-ink-sub transition hover:text-ink sm:block"
            >
              기능
            </a>
            <a
              href="#how"
              className="hidden text-sm font-medium text-ink-sub transition hover:text-ink sm:block"
            >
              사용법
            </a>
            <Link
              to={startPath}
              className="rounded-2xl border-2 border-kakao-ink bg-kakao-marketing px-4 py-2 text-sm font-bold text-kakao-ink transition hover:brightness-95"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      {/* ───── 히어로 ───── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#FFFBE0] via-white to-white" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
          {/* 왼쪽: 카피 */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-kakao px-3 py-1 text-xs font-bold text-kakao-ink">
              <Zap size={14} />
              실시간 채팅 웹앱
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              친구와의 대화,
              <br />
              끊김 없이{' '}
              <span className="relative whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-1 -z-10 h-4 bg-kakao" />
                실시간으로.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-sub lg:mx-0 sm:text-lg">
              1:1부터 그룹까지 — 새로고침 없이 바로 도착하는 메시지. 익숙한 카카오
              스타일 UI에, 빠른 실시간 기술을 더했어요.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <MarketingPill to={startPath} className="w-full sm:w-auto">
                무료로 시작하기
                <ArrowRight size={18} />
              </MarketingPill>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-line px-5 py-3 text-base font-semibold text-ink-body transition hover:bg-surface sm:w-auto"
              >
                기능 둘러보기
              </a>
            </div>

            <p className="mt-5 text-sm text-ink-light">
              설치 불필요 · 웹에서 바로 · 완전 무료
            </p>
          </div>

          {/* 오른쪽: 휴대폰 목업 */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ───── 기능 ───── */}
      <section id="features" className="border-t border-line-subtle bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              대화에 필요한 모든 것
            </h2>
            <p className="mt-4 text-ink-sub">
              메신저의 기본기에 충실하면서, 빠르고 안전하게.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kakao text-kakao-ink">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-sub">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 사용법 (3단계) ───── */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              3단계면 충분해요
            </h2>
            <p className="mt-4 text-ink-sub">복잡한 설정 없이 바로 시작해요.</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.no} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-kakao text-xl font-extrabold text-kakao-ink">
                  {s.no}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-sub">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 기술 스택 스트립 */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-medium uppercase tracking-widest text-ink-light">
              Powered by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#eeeeee] px-5 py-2 text-sm font-semibold text-ink-body"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── 하단 CTA 밴드 ───── */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-kakao px-8 py-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-kakao-ink sm:text-4xl">
            지금 바로 대화를 시작하세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-body">
            가입은 무료. 친구를 찾고, 첫 메시지를 보내보세요.
          </p>
          <Link
            to={startPath}
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-kakao-ink px-8 py-3.5 text-base font-bold text-white transition hover:brightness-125"
          >
            무료로 시작하기
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ───── 푸터 ───── */}
      <footer className="bg-kakao-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <Logo light />
          <p className="text-center text-xs text-ink-light sm:text-right">
            카카오톡 UI를 참고한 학습용 포트폴리오 프로젝트입니다.
            <br className="hidden sm:block" />
            <span className="text-ink-muted">
              {' '}
              © 2026 message. All rights reserved.
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
