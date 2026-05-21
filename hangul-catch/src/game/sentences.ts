import type { Category } from './words.ts';

export interface SentenceEntry {
  id: string;
  template: string;    // blanks marked as ___
  answers: string[];   // words to catch in order
  emojis: string[];    // emoji per answer
  category: Exclude<Category, 'all'>;
}

export const SENTENCE_LIST: SentenceEntry[] = [
  // ── 자연 (10) ─────────────────────────────────────────────────────────
  { id: 'sn01', template: '파란 ___에 하얀 ___이 떠요.',              answers: ['하늘', '구름'],  emojis: ['🌤️', '☁️'],   category: 'nature' },
  { id: 'sn02', template: '___이 살랑살랑 불면 ___이 흔들려요.',        answers: ['바람', '나무'],  emojis: ['💨', '🌳'],    category: 'nature' },
  { id: 'sn03', template: '저녁 ___이 지고 ___이 빛나요.',             answers: ['노을', '별빛'],  emojis: ['🌅', '⭐'],    category: 'nature' },
  { id: 'sn04', template: '풀잎에 ___이 맺히고 ___이 비춰요.',          answers: ['이슬', '햇빛'],  emojis: ['💧', '☀️'],    category: 'nature' },
  { id: 'sn05', template: '넓은 ___에서 ___이 철썩여요.',               answers: ['바다', '파도'],  emojis: ['🌊', '🌊'],    category: 'nature' },
  { id: 'sn06', template: '___이 내리면 ___에 꽃이 피어요.',            answers: ['봄비', '나무'],  emojis: ['🌧️', '🌳'],   category: 'nature' },
  { id: 'sn07', template: '___에 흰 ___이 피어올라요.',                answers: ['새벽', '안개'],  emojis: ['🌄', '🌫️'],   category: 'nature' },
  { id: 'sn08', template: '___이 지면 밤에는 ___이 빛나요.',            answers: ['햇빛', '달빛'],  emojis: ['☀️', '🌙'],    category: 'nature' },
  { id: 'sn09', template: '___이 몰아치면 ___도 거세게 쳐요.',          answers: ['폭풍', '파도'],  emojis: ['🌪️', '🌊'],   category: 'nature' },
  { id: 'sn10', template: '___에 예쁜 ___이 흩날려요.',                answers: ['봄비', '꽃잎'],  emojis: ['🌧️', '🌸'],   category: 'nature' },

  // ── 동물 (10) ─────────────────────────────────────────────────────────
  { id: 'sa01', template: '___가 깡충 뛰고 ___가 팔랑 날아요.',         answers: ['토끼', '나비'],  emojis: ['🐰', '🦋'],    category: 'animals' },
  { id: 'sa02', template: '___가 어흥 울고 ___가 꿀꿀 해요.',           answers: ['사자', '돼지'],  emojis: ['🦁', '🐷'],    category: 'animals' },
  { id: 'sa03', template: '___가 꽃밭을 날고 ___가 꿀을 모아요.',       answers: ['나비', '꿀벌'],  emojis: ['🦋', '🐝'],    category: 'animals' },
  { id: 'sa04', template: '___가 꽥꽥 울고 ___가 헤엄쳐요.',            answers: ['오리', '수달'],  emojis: ['🦆', '🦦'],    category: 'animals' },
  { id: 'sa05', template: '___가 꾀를 부리고 ___가 울부짖어요.',         answers: ['여우', '늑대'],  emojis: ['🦊', '🐺'],    category: 'animals' },
  { id: 'sa06', template: '여름에 ___가 맴맴 울고 ___가 날아다녀요.',    answers: ['매미', '나방'],  emojis: ['🦗', '🦋'],    category: 'animals' },
  { id: 'sa07', template: '___가 목을 뻗고 ___가 바다에서 헤엄쳐요.',   answers: ['기린', '고래'],  emojis: ['🦒', '🐋'],    category: 'animals' },
  { id: 'sa08', template: '___가 얼음 위에 서고 ___가 입을 벌려요.',    answers: ['펭귄', '악어'],  emojis: ['🐧', '🐊'],    category: 'animals' },
  { id: 'sa09', template: '___가 강에 살고 ___가 바위에서 쉬어요.',     answers: ['하마', '물개'],  emojis: ['🦛', '🦭'],    category: 'animals' },
  { id: 'sa10', template: '아침에 ___가 지저귀고 ___가 날아와요.',       answers: ['참새', '까치'],  emojis: ['🐦', '🐦'],    category: 'animals' },

  // ── 음식 (10) ─────────────────────────────────────────────────────────
  { id: 'sf01', template: '빨간 ___과 보라색 ___를 먹어요.',             answers: ['사과', '포도'],  emojis: ['🍎', '🍇'],    category: 'food' },
  { id: 'sf02', template: '노란 ___를 삶고 주황 ___을 볶아요.',           answers: ['감자', '당근'],  emojis: ['🥔', '🥕'],    category: 'food' },
  { id: 'sf03', template: '달콤한 ___와 새콤한 ___를 먹어요.',            answers: ['과자', '딸기'],  emojis: ['🍪', '🍓'],    category: 'food' },
  { id: 'sf04', template: '엄마가 ___을 싸 주고 아빠가 ___를 사 왔어요.', answers: ['김밥', '피자'],  emojis: ['🍱', '🍕'],    category: 'food' },
  { id: 'sf05', template: '점심에 ___을 먹고 저녁에 ___를 먹어요.',       answers: ['라면', '만두'],  emojis: ['🍜', '🥟'],    category: 'food' },
  { id: 'sf06', template: '시원한 ___를 마시고 달콤한 ___를 마셔요.',     answers: ['우유', '주스'],  emojis: ['🥛', '🧃'],    category: 'food' },
  { id: 'sf07', template: '초록 ___와 아삭한 ___를 먹어요.',              answers: ['수박', '오이'],  emojis: ['🍉', '🥒'],    category: 'food' },
  { id: 'sf08', template: '달콤한 ___와 쫄깃한 ___를 먹어요.',            answers: ['젤리', '도넛'],  emojis: ['🍬', '🍩'],    category: 'food' },
  { id: 'sf09', template: '동그란 ___을 자르고 부드러운 ___를 먹어요.',   answers: ['양파', '두부'],  emojis: ['🧅', '🥢'],    category: 'food' },
  { id: 'sf10', template: '여름에 ___를 먹고 시원한 ___를 마셔요.',       answers: ['참외', '주스'],  emojis: ['🍈', '🧃'],    category: 'food' },

  // ── 생활 (10) ─────────────────────────────────────────────────────────
  { id: 'sd01', template: '비가 와서 ___을 쓰고 ___을 신어요.',           answers: ['우산', '신발'],  emojis: ['☂️', '👟'],    category: 'daily' },
  { id: 'sd02', template: '___을 메고 머리에 ___를 써요.',                answers: ['가방', '모자'],  emojis: ['👜', '🎩'],    category: 'daily' },
  { id: 'sd03', template: '___로 글씨를 쓰고 ___에 정리해요.',            answers: ['연필', '공책'],  emojis: ['✏️', '📓'],    category: 'daily' },
  { id: 'sd04', template: '___에 앉아서 ___에서 공부해요.',               answers: ['의자', '책상'],  emojis: ['🪑', '📚'],    category: 'daily' },
  { id: 'sd05', template: '___에서 자고 ___을 보며 일어나요.',            answers: ['침대', '시계'],  emojis: ['🛏️', '⏰'],   category: 'daily' },
  { id: 'sd06', template: '손을 ___로 씻고 ___로 닦아요.',               answers: ['비누', '수건'],  emojis: ['🧼', '🧣'],    category: 'daily' },
  { id: 'sd07', template: '아침에 ___로 양치하고 ___을 봐요.',            answers: ['칫솔', '거울'],  emojis: ['🪥', '🪞'],    category: 'daily' },
  { id: 'sd08', template: '___에 음식을 담고 ___에 올려요.',              answers: ['그릇', '접시'],  emojis: ['🥣', '🍽️'],   category: 'daily' },
  { id: 'sd09', template: '___로 문을 열고 ___을 열어요.',               answers: ['열쇠', '창문'],  emojis: ['🔑', '🪟'],    category: 'daily' },
  { id: 'sd10', template: '___이 울리면 일어나고 ___이 오면 받아요.',     answers: ['시계', '전화'],  emojis: ['⏰', '📞'],    category: 'daily' },

  // ── 가족 (5) ──────────────────────────────────────────────────────────
  { id: 'sp01', template: '___가 요리하고 ___가 설거지해요.',             answers: ['엄마', '아빠'],  emojis: ['👩', '👨'],    category: 'family' },
  { id: 'sp02', template: '___와 ___가 같이 공부해요.',                   answers: ['언니', '동생'],  emojis: ['👧', '🧒'],    category: 'family' },
  { id: 'sp03', template: '___와 ___가 함께 놀러가요.',                   answers: ['오빠', '친구'],  emojis: ['👦', '🤝'],    category: 'family' },
  { id: 'sp04', template: '___를 안고 ___가 웃어요.',                     answers: ['아기', '엄마'],  emojis: ['👶', '👩'],    category: 'family' },
  { id: 'sp05', template: '___와 ___가 함께 밥을 먹어요.',                answers: ['누나', '동생'],  emojis: ['👩', '🧒'],    category: 'family' },

  // ── 장소 (5) ──────────────────────────────────────────────────────────
  { id: 'sl01', template: '___에서 공부하고 ___에서 놀아요.',             answers: ['학교', '공원'],  emojis: ['🏫', '🌳'],    category: 'places' },
  { id: 'sl02', template: '___를 타고 ___에 도착해요.',                   answers: ['버스', '학교'],  emojis: ['🚌', '🏫'],    category: 'places' },
  { id: 'sl03', template: '___에서 장을 보고 ___를 타고 가요.',           answers: ['시장', '버스'],  emojis: ['🏪', '🚌'],    category: 'places' },
  { id: 'sl04', template: '___를 타고 ___에서 내려요.',                   answers: ['기차', '도시'],  emojis: ['🚂', '🏙️'],   category: 'places' },
  { id: 'sl05', template: '___를 타고 ___에 가요.',                       answers: ['택시', '병원'],  emojis: ['🚕', '🏥'],    category: 'places' },
];

export function getSentencesByCategory(category: Category): SentenceEntry[] {
  if (category === 'all') return SENTENCE_LIST;
  return SENTENCE_LIST.filter((s) => s.category === category);
}
