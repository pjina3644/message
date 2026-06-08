import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 대시보드 > Project Settings > API 에서 값 복사
// 프론트엔드에는 'anon' 키만 사용한다 (service_role 키 절대 노출 금지)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수가 아직 비어 있으면 화면에서 안내할 수 있도록 플래그로 노출
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// 키가 없으면 createClient가 던지므로, 설정 전에는 null을 내보낸다
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
