import { Link } from 'react-router-dom'

// 카톡 옐로 (앱의 말풍선과 동일한 색)
const BRAND = '#fef01b'

const features = [
  {
    icon: '⚡',
    title: '실시간 메시지',
    desc: '보내는 즉시 도착. 새로고침이 필요 없는 Realtime 동기화로 대화가 끊기지 않습니다.',
  },
  {
    icon: '💬',
    title: '1:1 & 그룹 채팅',
    desc: '둘만의 대화도, 여럿이 모인 단체방도. 원하는 사람과 자유롭게 방을 만드세요.',
  },
  {
    icon: '✅',
    title: '읽음 표시',
    desc: "상대가 읽었는지 한눈에. 카톡의 '1' 처럼 안 읽은 메시지를 명확하게 보여줍니다.",
  },
  {
    icon: '🖼️',
    title: '이미지 전송',
    desc: '사진을 대화 속에 바로 공유. 글로 다 못한 순간을 이미지로 전하세요.',
  },
  {
    icon: '🔍',
    title: '친구 찾기',
    desc: '닉네임으로 검색해 새로운 사람과 대화를 시작하세요. 연결은 한 번의 클릭이면 충분합니다.',
  },
  {
    icon: '🔒',
    title: '안전한 보안',
    desc: '행 단위 접근 제어(RLS)로 내 대화는 나와 상대만. 방 멤버가 아니면 들여다볼 수 없습니다.',
  },
]

const steps = [
  { no: '01', title: '가입하기', desc: '이메일 또는 구글 계정으로 30초 만에 시작.' },
  { no: '02', title: '친구 찾기', desc: '닉네임으로 검색해 대화 상대를 추가.' },
  { no: '03', title: '대화 시작', desc: '메시지를 보내면 실시간으로 바로 전달.' },
]

const stack = ['React', 'Vite', 'Tailwind CSS', 'Supabase']

// 브랜드 로고 — 노란 말풍선 + 워드마크
function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-xl text-lg shadow-sm"
        style={{ backgroundColor: BRAND }}
      >
        💬
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        message
      </span>
    </Link>
  )
}

// 히어로 옆 휴대폰 목업 — 실제 채팅방(ChatRoom) 모습을 축소 재현
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[300px]">
      {/* 뒤쪽 장식용 옐로 블롭 */}
      <div
        className="absolute -inset-6 -z-10 rounded-[3rem] opacity-40 blur-2xl"
        style={{ backgroundColor: BRAND }}
      />
      <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-gray-900 bg-[#b2c7d9] shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center gap-2 bg-[#b2c7d9] px-4 pt-5 pb-3">
          <span className="text-gray-700">←</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-sm">
            🌤️
          </div>
          <span className="text-sm font-semibold text-gray-800">김하늘</span>
        </div>

        {/* 메시지 */}
        <div className="flex flex-col gap-2 px-4 py-3" style={{ minHeight: 320 }}>
          <div className="flex items-end gap-1.5">
            <div className="max-w-[70%] rounded-2xl bg-white px-3 py-2 text-[13px] text-gray-900 shadow-sm">
              안녕! 잘 지내?
            </div>
            <span className="text-[9px] text-gray-500">9:10</span>
          </div>

          <div className="flex items-end justify-end gap-1.5">
            <span className="text-[9px] text-gray-500">9:12</span>
            <div
              className="max-w-[70%] rounded-2xl px-3 py-2 text-[13px] text-gray-900 shadow-sm"
              style={{ backgroundColor: BRAND }}
            >
              응 잘 지내~ 너는?
            </div>
          </div>

          <div className="flex items-end gap-1.5">
            <div className="max-w-[70%] rounded-2xl bg-white px-3 py-2 text-[13px] text-gray-900 shadow-sm">
              나도 좋아 ㅎㅎ
            </div>
            <span className="text-[9px] text-gray-500">9:13</span>
          </div>

          <div className="flex items-end justify-end gap-1.5">
            <span className="text-[9px] text-gray-500">방금</span>
            <div
              className="max-w-[70%] rounded-2xl px-3 py-2 text-[13px] text-gray-900 shadow-sm"
              style={{ backgroundColor: BRAND }}
            >
              내일 시간 괜찮아? 😊
            </div>
          </div>
        </div>

        {/* 입력창 */}
        <div className="flex items-center gap-2 bg-white px-3 py-2.5">
          <div className="flex-1 rounded-full bg-gray-100 px-3 py-1.5 text-[12px] text-gray-400">
            메시지 입력
          </div>
          <div
            className="rounded-full px-3 py-1.5 text-[12px] font-medium text-gray-900"
            style={{ backgroundColor: BRAND }}
          >
            전송
          </div>
        </div>
      </div>
    </div>
  )
}

function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ───── 상단 네비게이션 ───── */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block"
            >
              기능
            </a>
            <a
              href="#how"
              className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block"
            >
              사용법
            </a>
            <Link
              to="/app"
              className="rounded-full px-4 py-2 text-sm font-bold text-gray-900 shadow-sm transition hover:brightness-95"
              style={{ backgroundColor: BRAND }}
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      {/* ───── 히어로 ───── */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-yellow-50 via-white to-white" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
          {/* 왼쪽: 카피 */}
          <div className="text-center lg:text-left">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-gray-900"
              style={{ backgroundColor: BRAND }}
            >
              ⚡ 실시간 채팅 웹앱
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              친구와의 대화,
              <br />
              끊김 없이{' '}
              <span className="relative whitespace-nowrap">
                <span
                  className="absolute inset-x-0 bottom-1 -z-10 h-4"
                  style={{ backgroundColor: BRAND }}
                />
                실시간으로.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-600 lg:mx-0 sm:text-lg">
              1:1부터 그룹까지 — 새로고침 없이 바로 도착하는 메시지. 익숙한
              카톡 스타일 UI에, 빠른 실시간 기술을 더했습니다.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <Link
                to="/app"
                className="w-full rounded-full px-7 py-3.5 text-center text-base font-bold text-gray-900 shadow-md transition hover:brightness-95 sm:w-auto"
                style={{ backgroundColor: BRAND }}
              >
                무료로 시작하기 →
              </Link>
              <a
                href="#features"
                className="w-full rounded-full border border-gray-200 px-7 py-3.5 text-center text-base font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                기능 둘러보기
              </a>
            </div>

            <p className="mt-5 text-sm text-gray-400">
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
      <section id="features" className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              대화에 필요한 모든 것
            </h2>
            <p className="mt-4 text-gray-600">
              메신저의 기본기에 충실하면서, 빠르고 안전하게.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: BRAND }}
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {f.desc}
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
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              3단계면 충분해요
            </h2>
            <p className="mt-4 text-gray-600">복잡한 설정 없이 바로 시작합니다.</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.no} className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold text-gray-900"
                  style={{ backgroundColor: BRAND }}
                >
                  {s.no}
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 기술 스택 스트립 */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Powered by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-semibold text-gray-700"
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
        <div
          className="mx-auto max-w-5xl rounded-3xl px-8 py-14 text-center shadow-lg"
          style={{ backgroundColor: BRAND }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            지금 바로 대화를 시작하세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-800">
            가입은 무료. 친구를 찾고, 첫 메시지를 보내보세요.
          </p>
          <Link
            to="/app"
            className="mt-7 inline-block rounded-full bg-gray-900 px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-gray-800"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* ───── 푸터 ───── */}
      <footer className="border-t border-gray-100 bg-gray-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <Logo light />
          <p className="text-center text-xs text-gray-400 sm:text-right">
            카카오톡 UI를 참고한 학습용 포트폴리오 프로젝트입니다.
            <br className="hidden sm:block" />
            <span className="text-gray-500"> © 2026 message. All rights reserved.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
