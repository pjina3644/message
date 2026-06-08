# message — 실시간 채팅 웹앱

카카오톡 스타일의 실시간 1:1 / 그룹 채팅 웹앱 (포트폴리오 / 학습용).

> 📄 상세 기획은 [docs/채팅앱_프로젝트_계획서.md](docs/채팅앱_프로젝트_계획서.md) 참고.

## 기술 스택

- **프론트엔드:** React + Vite
- **스타일:** Tailwind CSS v4
- **백엔드(BaaS):** Supabase (Auth / Postgres / Realtime / Storage)
- **배포:** Vercel (예정)

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 — .env.example 을 복사해 .env 생성 후 값 채우기
#    PowerShell:  Copy-Item .env.example .env
cp .env.example .env

# 3. 개발 서버 실행
npm run dev
```

`.env` 에 Supabase 값을 채워야 백엔드 기능이 동작합니다:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 값은 Supabase 대시보드 > **Project Settings > API** 에서 복사합니다.
> 프론트엔드에는 `anon` 키만 사용하세요 (`service_role` 키는 절대 노출 금지).

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |

## 개발 로드맵

0. ✅ 셋업 (Vite + Tailwind + Supabase 클라이언트)
1. ⬜ 정적 UI 클론 (채팅방 목록 / 채팅방 / 친구 탭)
2. ⬜ 인증 (이메일 + Google OAuth)
3. ⬜ 1:1 실시간 메시지 (★ 핵심)
4. ⬜ 채팅방 목록 고도화 (미리보기 / 안 읽은 수)
5. ⬜ 프로필 + 이미지 (Storage)
6. ⬜ 그룹 채팅
7. ⬜ 마무리 & 배포

자세한 단계별 내용은 [기획서](docs/채팅앱_프로젝트_계획서.md) 7번 항목 참고.
