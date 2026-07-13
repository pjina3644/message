import { Users } from './Icons'

// DESIGN.md: KakaoTalk 아바타는 원이 아니라 12px 라운드 스퀘어.
// 실제 프로필 사진이 없으므로 이름 첫 글자 + 결정적 배경색으로 대체(이모지 금지).

// 따뜻하고 플랫한 톤의 옅은 배경 — 옐로(브랜드 전용)는 제외
const COLORS = [
  '#FFD8D8', '#FFE3BF', '#FFEFA8', '#D7EFD7',
  '#CFE7FF', '#E2D9FF', '#FFD9EC', '#D9F2EC',
]

function colorFor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return COLORS[h % COLORS.length]
}

// 12px 라운드 스퀘어 고정(rounded-xl), 크기만 변형
const SIZES = {
  sm: { box: 'h-9 w-9 text-xs', icon: 18 },
  md: { box: 'h-12 w-12 text-base', icon: 22 },
  lg: { box: 'h-14 w-14 text-lg', icon: 26 },
  xl: { box: 'h-20 w-20 text-2xl', icon: 36 },
}

function Avatar({ name = '', url = '', group = false, size = 'md', className = '' }) {
  const s = SIZES[size] || SIZES.md

  if (group) {
    return (
      <div
        className={`flex ${s.box} shrink-0 items-center justify-center rounded-xl bg-fill text-ink-muted ${className}`}
      >
        <Users size={s.icon} />
      </div>
    )
  }

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${s.box} shrink-0 rounded-xl object-cover ${className}`}
      />
    )
  }

  const initial = name.trim().charAt(0) || '?'
  return (
    <div
      className={`flex ${s.box} shrink-0 items-center justify-center rounded-xl font-semibold text-ink-body ${className}`}
      style={{ backgroundColor: colorFor(name) }}
    >
      {initial}
    </div>
  )
}

export default Avatar
