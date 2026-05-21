export type Category = 'all' | 'nature' | 'animals' | 'food' | 'daily' | 'family' | 'colors' | 'places';

export interface WordEntry {
  id: string;
  word: string;
  meaning: string;
  syllables: [string, string];
  category: Exclude<Category, 'all'>;
  emoji: string;
}

export interface CategoryInfo {
  label: string;
  emoji: string;
  description: string;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  all:     { label: '전체',  emoji: '🌈', description: '모든 주제 섞기' },
  nature:  { label: '자연',  emoji: '🌿', description: '하늘·바다·바람' },
  animals: { label: '동물',  emoji: '🐾', description: '토끼·사자·고래' },
  food:    { label: '음식',  emoji: '🍎', description: '사과·딸기·김밥' },
  daily:   { label: '생활',  emoji: '🏠', description: '가방·연필·시계' },
  family:  { label: '가족',  emoji: '👨‍👩‍👧', description: '엄마·아빠·친구' },
  colors:  { label: '색깔',  emoji: '🎨', description: '빨강·파랑·노랑' },
  places:  { label: '장소',  emoji: '🚗', description: '학교·공원·시장' },
};

export const WORD_LIST: WordEntry[] = [
  // ── 자연 (20) ─────────────────────────────────────────────────────
  { id: 'n01', word: '나무', meaning: '나무',  syllables: ['나', '무'], category: 'nature',  emoji: '🌳' },
  { id: 'n02', word: '바다', meaning: '바다',  syllables: ['바', '다'], category: 'nature',  emoji: '🌊' },
  { id: 'n03', word: '구름', meaning: '구름',  syllables: ['구', '름'], category: 'nature',  emoji: '☁️' },
  { id: 'n04', word: '하늘', meaning: '하늘',  syllables: ['하', '늘'], category: 'nature',  emoji: '🌤️' },
  { id: 'n05', word: '봄비', meaning: '봄비',  syllables: ['봄', '비'], category: 'nature',  emoji: '🌧️' },
  { id: 'n06', word: '별빛', meaning: '별빛',  syllables: ['별', '빛'], category: 'nature',  emoji: '⭐' },
  { id: 'n07', word: '강물', meaning: '강물',  syllables: ['강', '물'], category: 'nature',  emoji: '🏞️' },
  { id: 'n08', word: '바람', meaning: '바람',  syllables: ['바', '람'], category: 'nature',  emoji: '💨' },
  { id: 'n09', word: '이슬', meaning: '이슬',  syllables: ['이', '슬'], category: 'nature',  emoji: '💧' },
  { id: 'n10', word: '노을', meaning: '노을',  syllables: ['노', '을'], category: 'nature',  emoji: '🌅' },
  { id: 'n11', word: '안개', meaning: '안개',  syllables: ['안', '개'], category: 'nature',  emoji: '🌫️' },
  { id: 'n12', word: '눈물', meaning: '눈물',  syllables: ['눈', '물'], category: 'nature',  emoji: '🌨️' },
  { id: 'n13', word: '꽃잎', meaning: '꽃잎',  syllables: ['꽃', '잎'], category: 'nature',  emoji: '🌸' },
  { id: 'n14', word: '모래', meaning: '모래',  syllables: ['모', '래'], category: 'nature',  emoji: '🏖️' },
  { id: 'n15', word: '파도', meaning: '파도',  syllables: ['파', '도'], category: 'nature',  emoji: '🌊' },
  { id: 'n16', word: '냇물', meaning: '냇물',  syllables: ['냇', '물'], category: 'nature',  emoji: '💦' },
  { id: 'n17', word: '햇빛', meaning: '햇빛',  syllables: ['햇', '빛'], category: 'nature',  emoji: '☀️' },
  { id: 'n18', word: '달빛', meaning: '달빛',  syllables: ['달', '빛'], category: 'nature',  emoji: '🌙' },
  { id: 'n19', word: '새벽', meaning: '새벽',  syllables: ['새', '벽'], category: 'nature',  emoji: '🌄' },
  { id: 'n20', word: '폭풍', meaning: '폭풍',  syllables: ['폭', '풍'], category: 'nature',  emoji: '🌪️' },

  // ── 동물 (20) ─────────────────────────────────────────────────────
  { id: 'a01', word: '토끼', meaning: '토끼',  syllables: ['토', '끼'], category: 'animals', emoji: '🐰' },
  { id: 'a02', word: '나비', meaning: '나비',  syllables: ['나', '비'], category: 'animals', emoji: '🦋' },
  { id: 'a03', word: '사자', meaning: '사자',  syllables: ['사', '자'], category: 'animals', emoji: '🦁' },
  { id: 'a04', word: '돼지', meaning: '돼지',  syllables: ['돼', '지'], category: 'animals', emoji: '🐷' },
  { id: 'a05', word: '오리', meaning: '오리',  syllables: ['오', '리'], category: 'animals', emoji: '🦆' },
  { id: 'a06', word: '여우', meaning: '여우',  syllables: ['여', '우'], category: 'animals', emoji: '🦊' },
  { id: 'a07', word: '늑대', meaning: '늑대',  syllables: ['늑', '대'], category: 'animals', emoji: '🐺' },
  { id: 'a08', word: '수달', meaning: '수달',  syllables: ['수', '달'], category: 'animals', emoji: '🦦' },
  { id: 'a09', word: '매미', meaning: '매미',  syllables: ['매', '미'], category: 'animals', emoji: '🦗' },
  { id: 'a10', word: '물개', meaning: '물개',  syllables: ['물', '개'], category: 'animals', emoji: '🦭' },
  { id: 'a11', word: '나방', meaning: '나방',  syllables: ['나', '방'], category: 'animals', emoji: '🦋' },
  { id: 'a12', word: '거미', meaning: '거미',  syllables: ['거', '미'], category: 'animals', emoji: '🕷️' },
  { id: 'a13', word: '하마', meaning: '하마',  syllables: ['하', '마'], category: 'animals', emoji: '🦛' },
  { id: 'a14', word: '꿀벌', meaning: '꿀벌',  syllables: ['꿀', '벌'], category: 'animals', emoji: '🐝' },
  { id: 'a15', word: '참새', meaning: '참새',  syllables: ['참', '새'], category: 'animals', emoji: '🐦' },
  { id: 'a16', word: '까치', meaning: '까치',  syllables: ['까', '치'], category: 'animals', emoji: '🐦' },
  { id: 'a17', word: '기린', meaning: '기린',  syllables: ['기', '린'], category: 'animals', emoji: '🦒' },
  { id: 'a18', word: '펭귄', meaning: '펭귄',  syllables: ['펭', '귄'], category: 'animals', emoji: '🐧' },
  { id: 'a19', word: '고래', meaning: '고래',  syllables: ['고', '래'], category: 'animals', emoji: '🐋' },
  { id: 'a20', word: '악어', meaning: '악어',  syllables: ['악', '어'], category: 'animals', emoji: '🐊' },

  // ── 음식 (20) ─────────────────────────────────────────────────────
  { id: 'f01', word: '사과', meaning: '사과',  syllables: ['사', '과'], category: 'food',    emoji: '🍎' },
  { id: 'f02', word: '포도', meaning: '포도',  syllables: ['포', '도'], category: 'food',    emoji: '🍇' },
  { id: 'f03', word: '감자', meaning: '감자',  syllables: ['감', '자'], category: 'food',    emoji: '🥔' },
  { id: 'f04', word: '당근', meaning: '당근',  syllables: ['당', '근'], category: 'food',    emoji: '🥕' },
  { id: 'f05', word: '양파', meaning: '양파',  syllables: ['양', '파'], category: 'food',    emoji: '🧅' },
  { id: 'f06', word: '딸기', meaning: '딸기',  syllables: ['딸', '기'], category: 'food',    emoji: '🍓' },
  { id: 'f07', word: '수박', meaning: '수박',  syllables: ['수', '박'], category: 'food',    emoji: '🍉' },
  { id: 'f08', word: '오이', meaning: '오이',  syllables: ['오', '이'], category: 'food',    emoji: '🥒' },
  { id: 'f09', word: '참외', meaning: '참외',  syllables: ['참', '외'], category: 'food',    emoji: '🍈' },
  { id: 'f10', word: '두부', meaning: '두부',  syllables: ['두', '부'], category: 'food',    emoji: '🥢' },
  { id: 'f11', word: '과자', meaning: '과자',  syllables: ['과', '자'], category: 'food',    emoji: '🍪' },
  { id: 'f12', word: '김밥', meaning: '김밥',  syllables: ['김', '밥'], category: 'food',    emoji: '🍱' },
  { id: 'f13', word: '냉면', meaning: '냉면',  syllables: ['냉', '면'], category: 'food',    emoji: '🍜' },
  { id: 'f14', word: '라면', meaning: '라면',  syllables: ['라', '면'], category: 'food',    emoji: '🍜' },
  { id: 'f15', word: '피자', meaning: '피자',  syllables: ['피', '자'], category: 'food',    emoji: '🍕' },
  { id: 'f16', word: '젤리', meaning: '젤리',  syllables: ['젤', '리'], category: 'food',    emoji: '🍬' },
  { id: 'f17', word: '우유', meaning: '우유',  syllables: ['우', '유'], category: 'food',    emoji: '🥛' },
  { id: 'f18', word: '만두', meaning: '만두',  syllables: ['만', '두'], category: 'food',    emoji: '🥟' },
  { id: 'f19', word: '도넛', meaning: '도넛',  syllables: ['도', '넛'], category: 'food',    emoji: '🍩' },
  { id: 'f20', word: '주스', meaning: '주스',  syllables: ['주', '스'], category: 'food',    emoji: '🧃' },

  // ── 생활 (20) ─────────────────────────────────────────────────────
  { id: 'd01', word: '우산', meaning: '우산',  syllables: ['우', '산'], category: 'daily',   emoji: '☂️' },
  { id: 'd02', word: '가방', meaning: '가방',  syllables: ['가', '방'], category: 'daily',   emoji: '👜' },
  { id: 'd03', word: '모자', meaning: '모자',  syllables: ['모', '자'], category: 'daily',   emoji: '🎩' },
  { id: 'd04', word: '신발', meaning: '신발',  syllables: ['신', '발'], category: 'daily',   emoji: '👟' },
  { id: 'd05', word: '연필', meaning: '연필',  syllables: ['연', '필'], category: 'daily',   emoji: '✏️' },
  { id: 'd06', word: '공책', meaning: '공책',  syllables: ['공', '책'], category: 'daily',   emoji: '📓' },
  { id: 'd07', word: '책상', meaning: '책상',  syllables: ['책', '상'], category: 'daily',   emoji: '📚' },
  { id: 'd08', word: '의자', meaning: '의자',  syllables: ['의', '자'], category: 'daily',   emoji: '🪑' },
  { id: 'd09', word: '침대', meaning: '침대',  syllables: ['침', '대'], category: 'daily',   emoji: '🛏️' },
  { id: 'd10', word: '창문', meaning: '창문',  syllables: ['창', '문'], category: 'daily',   emoji: '🪟' },
  { id: 'd11', word: '거울', meaning: '거울',  syllables: ['거', '울'], category: 'daily',   emoji: '🪞' },
  { id: 'd12', word: '수건', meaning: '수건',  syllables: ['수', '건'], category: 'daily',   emoji: '🧣' },
  { id: 'd13', word: '비누', meaning: '비누',  syllables: ['비', '누'], category: 'daily',   emoji: '🧼' },
  { id: 'd14', word: '칫솔', meaning: '칫솔',  syllables: ['칫', '솔'], category: 'daily',   emoji: '🪥' },
  { id: 'd15', word: '냄비', meaning: '냄비',  syllables: ['냄', '비'], category: 'daily',   emoji: '🍳' },
  { id: 'd16', word: '접시', meaning: '접시',  syllables: ['접', '시'], category: 'daily',   emoji: '🍽️' },
  { id: 'd17', word: '그릇', meaning: '그릇',  syllables: ['그', '릇'], category: 'daily',   emoji: '🥣' },
  { id: 'd18', word: '열쇠', meaning: '열쇠',  syllables: ['열', '쇠'], category: 'daily',   emoji: '🔑' },
  { id: 'd19', word: '시계', meaning: '시계',  syllables: ['시', '계'], category: 'daily',   emoji: '⏰' },
  { id: 'd20', word: '전화', meaning: '전화',  syllables: ['전', '화'], category: 'daily',   emoji: '📞' },

  // ── 가족/사람 (10) ─────────────────────────────────────────────────
  { id: 'p01', word: '엄마', meaning: '엄마',  syllables: ['엄', '마'], category: 'family',  emoji: '👩' },
  { id: 'p02', word: '아빠', meaning: '아빠',  syllables: ['아', '빠'], category: 'family',  emoji: '👨' },
  { id: 'p03', word: '언니', meaning: '언니',  syllables: ['언', '니'], category: 'family',  emoji: '👧' },
  { id: 'p04', word: '오빠', meaning: '오빠',  syllables: ['오', '빠'], category: 'family',  emoji: '👦' },
  { id: 'p05', word: '동생', meaning: '동생',  syllables: ['동', '생'], category: 'family',  emoji: '🧒' },
  { id: 'p06', word: '누나', meaning: '누나',  syllables: ['누', '나'], category: 'family',  emoji: '👩' },
  { id: 'p07', word: '친구', meaning: '친구',  syllables: ['친', '구'], category: 'family',  emoji: '🤝' },
  { id: 'p08', word: '아기', meaning: '아기',  syllables: ['아', '기'], category: 'family',  emoji: '👶' },
  { id: 'p09', word: '선배', meaning: '선배',  syllables: ['선', '배'], category: 'family',  emoji: '🧑' },
  { id: 'p10', word: '이웃', meaning: '이웃',  syllables: ['이', '웃'], category: 'family',  emoji: '🏘️' },

  // ── 색깔 (10) ─────────────────────────────────────────────────────
  { id: 'c01', word: '빨강', meaning: '빨강',  syllables: ['빨', '강'], category: 'colors',  emoji: '🔴' },
  { id: 'c02', word: '파랑', meaning: '파랑',  syllables: ['파', '랑'], category: 'colors',  emoji: '🔵' },
  { id: 'c03', word: '노랑', meaning: '노랑',  syllables: ['노', '랑'], category: 'colors',  emoji: '🟡' },
  { id: 'c04', word: '초록', meaning: '초록',  syllables: ['초', '록'], category: 'colors',  emoji: '🟢' },
  { id: 'c05', word: '보라', meaning: '보라',  syllables: ['보', '라'], category: 'colors',  emoji: '🟣' },
  { id: 'c06', word: '하양', meaning: '하양',  syllables: ['하', '양'], category: 'colors',  emoji: '⚪' },
  { id: 'c07', word: '검정', meaning: '검정',  syllables: ['검', '정'], category: 'colors',  emoji: '⚫' },
  { id: 'c08', word: '주황', meaning: '주황',  syllables: ['주', '황'], category: 'colors',  emoji: '🟠' },
  { id: 'c09', word: '분홍', meaning: '분홍',  syllables: ['분', '홍'], category: 'colors',  emoji: '🩷' },
  { id: 'c10', word: '자주', meaning: '자주',  syllables: ['자', '주'], category: 'colors',  emoji: '🟣' },

  // ── 장소/탈것 (10) ─────────────────────────────────────────────────
  { id: 'l01', word: '학교', meaning: '학교',  syllables: ['학', '교'], category: 'places',  emoji: '🏫' },
  { id: 'l02', word: '병원', meaning: '병원',  syllables: ['병', '원'], category: 'places',  emoji: '🏥' },
  { id: 'l03', word: '시장', meaning: '시장',  syllables: ['시', '장'], category: 'places',  emoji: '🏪' },
  { id: 'l04', word: '공원', meaning: '공원',  syllables: ['공', '원'], category: 'places',  emoji: '🌳' },
  { id: 'l05', word: '가게', meaning: '가게',  syllables: ['가', '게'], category: 'places',  emoji: '🏬' },
  { id: 'l06', word: '마을', meaning: '마을',  syllables: ['마', '을'], category: 'places',  emoji: '🏘️' },
  { id: 'l07', word: '기차', meaning: '기차',  syllables: ['기', '차'], category: 'places',  emoji: '🚂' },
  { id: 'l08', word: '버스', meaning: '버스',  syllables: ['버', '스'], category: 'places',  emoji: '🚌' },
  { id: 'l09', word: '택시', meaning: '택시',  syllables: ['택', '시'], category: 'places',  emoji: '🚕' },
  { id: 'l10', word: '도시', meaning: '도시',  syllables: ['도', '시'], category: 'places',  emoji: '🏙️' },
];

export function getWordsByCategory(category: Category): WordEntry[] {
  if (category === 'all') return WORD_LIST;
  return WORD_LIST.filter((w) => w.category === category);
}
