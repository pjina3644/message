// 1단계 정적 UI용 더미 데이터.
// 3단계에서 Supabase(DB + Realtime) 데이터로 교체된다.

export const currentUser = {
  id: 'me',
  username: '나',
  statusMessage: '카톡 스타일 채팅앱 만드는 중 🛠️',
  avatar: '🙂',
}

export const friends = [
  { id: 'u1', username: '김하늘', statusMessage: '오늘도 화이팅!', avatar: '🌤️' },
  { id: 'u2', username: '이준호', statusMessage: '', avatar: '🧑‍💻' },
  { id: 'u3', username: '박서연', statusMessage: '여행 가고 싶다 ✈️', avatar: '🌷' },
  { id: 'u4', username: '최민수', statusMessage: '운동 중 💪', avatar: '🏃' },
  { id: 'u5', username: '정유진', statusMessage: '☕️', avatar: '🐱' },
]

export const chats = [
  {
    id: 'c1',
    type: 'direct',
    name: '김하늘',
    avatar: '🌤️',
    lastMessage: '내일 시간 괜찮아?',
    lastTime: '오후 9:24',
    unread: 2,
  },
  {
    id: 'c2',
    type: 'group',
    name: '프로젝트 팀방',
    avatar: '👥',
    lastMessage: '이준호: 회의록 공유했어요',
    lastTime: '오후 6:10',
    unread: 5,
  },
  {
    id: 'c3',
    type: 'direct',
    name: '박서연',
    avatar: '🌷',
    lastMessage: '사진 잘 받았어 고마워!',
    lastTime: '오후 2:47',
    unread: 0,
  },
  {
    id: 'c4',
    type: 'direct',
    name: '최민수',
    avatar: '🏃',
    lastMessage: '오늘 PT 같이 갈래?',
    lastTime: '오전 11:03',
    unread: 0,
  },
]

// chatId -> 메시지 목록
export const messagesByChat = {
  c1: [
    { id: 'm1', senderId: 'u1', text: '안녕! 잘 지내?', time: '오후 9:10' },
    { id: 'm2', senderId: 'me', text: '응 잘 지내~ 너는?', time: '오후 9:12' },
    { id: 'm3', senderId: 'u1', text: '나도 좋아 ㅎㅎ', time: '오후 9:13' },
    { id: 'm4', senderId: 'u1', text: '내일 시간 괜찮아?', time: '오후 9:24' },
  ],
  c2: [
    { id: 'm1', senderId: 'u2', text: '다들 안녕하세요 👋', time: '오후 5:50' },
    { id: 'm2', senderId: 'u3', text: '넵 안녕하세요!', time: '오후 5:52' },
    { id: 'm3', senderId: 'me', text: '오늘 회의 6시에 시작할게요', time: '오후 5:55' },
    { id: 'm4', senderId: 'u2', text: '회의록 공유했어요', time: '오후 6:10' },
  ],
  c3: [
    { id: 'm1', senderId: 'me', text: '여행 사진 보내줄게', time: '오후 2:40' },
    { id: 'm2', senderId: 'u3', text: '사진 잘 받았어 고마워!', time: '오후 2:47' },
  ],
  c4: [
    { id: 'm1', senderId: 'u4', text: '오늘 PT 같이 갈래?', time: '오전 11:03' },
  ],
}

export function getChatById(id) {
  return chats.find((c) => c.id === id)
}
