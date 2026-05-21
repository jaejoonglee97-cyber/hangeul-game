export type Category = 'all' | 'nature' | 'animals' | 'food' | 'daily';

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
  animals: { label: '동물',  emoji: '🐾', description: '토끼·사자·나비' },
  food:    { label: '음식',  emoji: '🍎', description: '사과·딸기·김밥' },
  daily:   { label: '생활',  emoji: '🏠', description: '가방·연필·의자' },
};

export const WORD_LIST: WordEntry[] = [
  // ── 자연 ──────────────────────────────────────
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

  // ── 동물 ──────────────────────────────────────
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

  // ── 음식 ──────────────────────────────────────
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

  // ── 생활 ──────────────────────────────────────
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
];

export function getWordsByCategory(category: Category): WordEntry[] {
  if (category === 'all') return WORD_LIST;
  return WORD_LIST.filter((w) => w.category === category);
}
