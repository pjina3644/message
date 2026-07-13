-- ============================================================
-- message 채팅앱 — Supabase 스키마 (테이블 + RLS + 트리거)
-- 사용법: Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN
-- 계획서 5번(데이터 모델) / 8번(보안 체크리스트) 기준
-- ============================================================

-- 1) profiles : auth.users 와 1:1로 연결되는 부가 정보 ----------
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  username       text,
  avatar_url     text,
  status_message text,
  created_at     timestamptz not null default now()
);

-- 2) chats : 채팅방 (1:1 / 그룹) -------------------------------
create table if not exists public.chats (
  id         uuid primary key default gen_random_uuid(),
  type       text not null default 'direct' check (type in ('direct', 'group')),
  name       text,                       -- 그룹방 이름 (1:1은 null)
  created_at timestamptz not null default now()
);

-- 3) chat_members : 유저↔채팅방 다대다 연결 (★ 핵심) -----------
create table if not exists public.chat_members (
  chat_id      uuid not null references public.chats (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  last_read_at timestamptz not null default now(),  -- "안 읽은 수" 계산 근거
  joined_at    timestamptz not null default now(),
  primary key (chat_id, user_id)
);

-- 4) messages : 메시지 ----------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references public.chats (id) on delete cascade,
  sender_id  uuid not null references public.profiles (id) on delete cascade,
  content    text not null,
  type       text not null default 'text' check (type in ('text', 'image')),
  created_at timestamptz not null default now()
);

create index if not exists messages_chat_id_created_at_idx
  on public.messages (chat_id, created_at);

-- ============================================================
-- 멤버십 확인 헬퍼 (RLS 재귀 방지용 SECURITY DEFINER 함수)
-- chat_members 정책 안에서 chat_members 를 직접 조회하면 무한 재귀가
-- 발생하므로, RLS를 우회하는 함수로 분리한다.
-- ============================================================
create or replace function public.is_chat_member(_chat_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.chat_members
    where chat_id = _chat_id and user_id = auth.uid()
  );
$$;

-- ============================================================
-- RLS 활성화 (계획서 8번: 모든 테이블에 RLS 필수)
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.chats        enable row level security;
alter table public.chat_members enable row level security;
alter table public.messages     enable row level security;

-- profiles -----------------------------------------------------
-- 검색을 위해 모든 로그인 유저가 프로필 조회 가능, 수정은 본인만
create policy "profiles_select_all" on public.profiles
  for select to authenticated using (true);

create policy "profiles_insert_self" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid());

-- chats --------------------------------------------------------
-- 방 멤버만 조회 가능, 로그인 유저는 새 방 생성 가능
create policy "chats_select_member" on public.chats
  for select to authenticated using (public.is_chat_member(id));

create policy "chats_insert_authenticated" on public.chats
  for insert to authenticated with check (true);

-- chat_members -------------------------------------------------
-- 내가 속한 방의 멤버 목록만 조회
create policy "chat_members_select_member" on public.chat_members
  for select to authenticated using (public.is_chat_member(chat_id));

-- 본인을 추가하거나(방 생성), 이미 멤버라면 다른 사람 초대 가능
create policy "chat_members_insert" on public.chat_members
  for insert to authenticated
  with check (user_id = auth.uid() or public.is_chat_member(chat_id));

-- 읽음 처리(last_read_at) 등 본인 멤버십 행만 수정
create policy "chat_members_update_self" on public.chat_members
  for update to authenticated using (user_id = auth.uid());

-- messages -----------------------------------------------------
-- 방 멤버만 메시지 조회, 방 멤버 본인만 메시지 전송
create policy "messages_select_member" on public.messages
  for select to authenticated using (public.is_chat_member(chat_id));

create policy "messages_insert_member" on public.messages
  for insert to authenticated
  with check (sender_id = auth.uid() and public.is_chat_member(chat_id));

-- ============================================================
-- 회원가입 시 profiles 행 자동 생성 트리거
-- (auth.users 에 새 유저가 생기면 빈 프로필을 만들어 둔다)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Realtime: messages 테이블 변경을 구독할 수 있도록 publication 추가
-- (3단계 실시간 수신에 필요)
-- ============================================================
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- RPC: get_my_chats() - 내 채팅방 목록 및 메타데이터 조회
-- ============================================================
create or replace function public.get_my_chats()
returns table (
  chat_id uuid,
  type text,
  name text,
  last_message text,
  last_time timestamptz,
  unread_count bigint,
  avatar_url text
)
language plpgsql
security definer
as $$
begin
  return query
  with user_chats as (
    select cm.chat_id, cm.last_read_at
    from public.chat_members cm
    where cm.user_id = auth.uid()
  ),
  chat_last_msg as (
    select distinct on (m.chat_id)
      m.chat_id,
      m.content,
      m.created_at
    from public.messages m
    join user_chats uc on m.chat_id = uc.chat_id
    order by m.chat_id, m.created_at desc
  ),
  chat_unread as (
    select uc.chat_id, count(m.id) as count
    from user_chats uc
    left join public.messages m on m.chat_id = uc.chat_id and m.created_at > uc.last_read_at
    group by uc.chat_id
  ),
  chat_other_member as (
    select 
      cm.chat_id, 
      max(p.username) as username,
      max(p.avatar_url) as avatar_url
    from public.chat_members cm
    join public.profiles p on cm.user_id = p.id
    where cm.user_id != auth.uid()
    group by cm.chat_id
  )
  select 
    c.id as chat_id,
    c.type,
    case 
      when c.type = 'direct' then com.username 
      else c.name 
    end as name,
    clm.content as last_message,
    clm.created_at as last_time,
    coalesce(cu.count, 0) as unread_count,
    case
      when c.type = 'direct' then com.avatar_url
      else null
    end as avatar_url
  from public.chats c
  join user_chats uc on c.id = uc.chat_id
  left join chat_last_msg clm on c.id = clm.chat_id
  left join chat_unread cu on c.id = cu.chat_id
  left join chat_other_member com on c.id = com.chat_id;
end;
$$;

-- ============================================================
-- RPC: get_or_create_direct_chat(_friend_id) - 1:1 방 생성 및 조회
-- ============================================================
create or replace function public.get_or_create_direct_chat(_friend_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  _chat_id uuid;
begin
  select cm1.chat_id into _chat_id
  from public.chat_members cm1
  join public.chat_members cm2 on cm1.chat_id = cm2.chat_id
  join public.chats c on cm1.chat_id = c.id
  where c.type = 'direct'
    and cm1.user_id = auth.uid()
    and cm2.user_id = _friend_id;
    
  if _chat_id is null then
    insert into public.chats (type)
    values ('direct')
    returning id into _chat_id;
    
    insert into public.chat_members (chat_id, user_id)
    values 
      (_chat_id, auth.uid()),
      (_chat_id, _friend_id);
  end if;
  
  return _chat_id;
end;
$$;

