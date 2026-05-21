export interface WordEntry {
  id: string;
  word: string;
  meaning: string;
  syllables: [string, string];
}

export const WORD_LIST: WordEntry[] = [
  { id: 'w01', word: '나무', meaning: '나무 (tree)', syllables: ['나', '무'] },
  { id: 'w02', word: '사과', meaning: '사과 (apple)', syllables: ['사', '과'] },
  { id: 'w03', word: '우산', meaning: '우산 (umbrella)', syllables: ['우', '산'] },
  { id: 'w04', word: '바다', meaning: '바다 (sea)', syllables: ['바', '다'] },
  { id: 'w05', word: '토끼', meaning: '토끼 (rabbit)', syllables: ['토', '끼'] },
  { id: 'w06', word: '나비', meaning: '나비 (butterfly)', syllables: ['나', '비'] },
  { id: 'w07', word: '구름', meaning: '구름 (cloud)', syllables: ['구', '름'] },
  { id: 'w08', word: '하늘', meaning: '하늘 (sky)', syllables: ['하', '늘'] },
  { id: 'w09', word: '가방', meaning: '가방 (bag)', syllables: ['가', '방'] },
  { id: 'w10', word: '모자', meaning: '모자 (hat)', syllables: ['모', '자'] },
  { id: 'w11', word: '신발', meaning: '신발 (shoes)', syllables: ['신', '발'] },
  { id: 'w12', word: '연필', meaning: '연필 (pencil)', syllables: ['연', '필'] },
  { id: 'w13', word: '공책', meaning: '공책 (notebook)', syllables: ['공', '책'] },
  { id: 'w14', word: '책상', meaning: '책상 (desk)', syllables: ['책', '상'] },
  { id: 'w15', word: '의자', meaning: '의자 (chair)', syllables: ['의', '자'] },
  { id: 'w16', word: '새벽', meaning: '새벽 (dawn)', syllables: ['새', '벽'] },
  { id: 'w17', word: '봄비', meaning: '봄비 (spring rain)', syllables: ['봄', '비'] },
  { id: 'w18', word: '별빛', meaning: '별빛 (starlight)', syllables: ['별', '빛'] },
  { id: 'w19', word: '눈물', meaning: '눈물 (tear)', syllables: ['눈', '물'] },
  { id: 'w20', word: '강물', meaning: '강물 (river water)', syllables: ['강', '물'] },
];
