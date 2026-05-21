import { WordEntry } from './words.ts';
import type { SentenceEntry } from './sentences.ts';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameStage = 'word' | 'sentence';

export interface Card {
  id: string;
  syllable: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isCorrect: boolean;
}

export interface WordRoundState {
  mode: 'word';
  word: WordEntry;
  hiddenIndex: 0 | 1;
  cards: Card[];
  startedAt: number;
}

export interface SentenceRoundState {
  mode: 'sentence';
  sentence: SentenceEntry;
  blankIndex: number;
  cards: Card[];
  startedAt: number;
}

export type RoundState = WordRoundState | SentenceRoundState;

export interface AttemptRecord {
  wordId: string;
  success: boolean;
  attempts: number;
  reactionMs: number;
  difficulty: DifficultyLevel;
}

export interface GameState {
  roundsDone: number;
  correctCount: number;
  totalAttempts: number;
  currentDifficulty: DifficultyLevel;
  history: AttemptRecord[];
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickSign(): number {
  return Math.random() < 0.5 ? 1 : -1;
}

interface Bounds {
  width: number;
  height: number;
}

function cardSize(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy':   return 128;
    case 'medium': return 112;
    case 'hard':   return 96;
  }
}

function baseSpeed(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy':   return 40;
    case 'medium': return 70;
    case 'hard':   return 100;
  }
}

function cardCount(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy':   return 3;
    case 'medium': return 3;
    case 'hard':   return 4;
  }
}

function spawnCards(
  syllables: string[],
  correctSyllable: string,
  difficulty: DifficultyLevel,
  bounds: Bounds,
  sizeBonus = 0,
): Card[] {
  const size = cardSize(difficulty) + sizeBonus;
  const speed = baseSpeed(difficulty);
  const margin = size + 10;

  return syllables.map((syl, i) => ({
    id: `card-${i}-${Date.now()}`,
    syllable: syl,
    x: randomBetween(margin, Math.max(margin * 2, bounds.width - margin)),
    y: randomBetween(margin, Math.max(margin * 2, bounds.height - margin)),
    vx: randomBetween(speed * 0.6, speed) * pickSign(),
    vy: randomBetween(speed * 0.6, speed) * pickSign(),
    width: size,
    height: size,
    isCorrect: syl === correctSyllable,
  }));
}

export function createRound(
  wordPool: WordEntry[],
  difficulty: DifficultyLevel,
  previouslyUsed: Set<string>,
  bounds: Bounds,
): WordRoundState {
  const available = wordPool.filter((w) => !previouslyUsed.has(w.id));
  const pool = available.length > 0 ? available : wordPool;
  const word = pool[Math.floor(Math.random() * pool.length)];

  const hiddenIndex: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  const correctSyllable = word.syllables[hiddenIndex];

  const allSyllables = wordPool
    .filter((w) => w.id !== word.id)
    .flatMap((w) => w.syllables);
  const uniqueDistractors = [...new Set(allSyllables)].filter((s) => s !== correctSyllable);
  const distractors = uniqueDistractors
    .sort(() => Math.random() - 0.5)
    .slice(0, cardCount(difficulty) - 1);

  const syllables = [correctSyllable, ...distractors].sort(() => Math.random() - 0.5);
  const cards = spawnCards(syllables, correctSyllable, difficulty, bounds);

  return { mode: 'word', word, hiddenIndex, cards, startedAt: Date.now() };
}

export function createSentenceRound(
  sentence: SentenceEntry,
  blankIndex: number,
  allWords: WordEntry[],
  difficulty: DifficultyLevel,
  bounds: Bounds,
): SentenceRoundState {
  const correctWord = sentence.answers[blankIndex];
  const numCards = cardCount(difficulty);

  const distractorPool = allWords
    .filter((w) => !sentence.answers.includes(w.word))
    .map((w) => w.word);
  const uniqueDistractors = [...new Set(distractorPool)].filter((w) => w !== correctWord);
  const distractors = uniqueDistractors
    .sort(() => Math.random() - 0.5)
    .slice(0, numCards - 1);

  const words = [correctWord, ...distractors].sort(() => Math.random() - 0.5);
  // sentence mode cards are slightly larger (display full 2-char words)
  const cards = spawnCards(words, correctWord, difficulty, bounds, 16);

  return { mode: 'sentence', sentence, blankIndex, cards, startedAt: Date.now() };
}

export function updateDifficulty(history: AttemptRecord[]): DifficultyLevel {
  const recent = history.slice(-5);
  if (recent.length < 3) return 'easy';
  const successRate = recent.filter((r) => r.success).length / recent.length;
  if (successRate >= 0.8) return 'hard';
  if (successRate >= 0.5) return 'medium';
  return 'easy';
}

export function updateCardPositions(cards: Card[], dt: number, bounds: Bounds): Card[] {
  return cards.map((card) => {
    let { x, y, vx, vy } = card;
    const halfW = card.width / 2;
    const halfH = card.height / 2;

    x += vx * dt;
    y += vy * dt;

    if (x - halfW < 0) { x = halfW; vx = Math.abs(vx); }
    else if (x + halfW > bounds.width) { x = bounds.width - halfW; vx = -Math.abs(vx); }

    if (y - halfH < 0) { y = halfH; vy = Math.abs(vy); }
    else if (y + halfH > bounds.height) { y = bounds.height - halfH; vy = -Math.abs(vy); }

    return { ...card, x, y, vx, vy };
  });
}

export function createInitialGameState(): GameState {
  return {
    roundsDone: 0,
    correctCount: 0,
    totalAttempts: 0,
    currentDifficulty: 'easy',
    history: [],
  };
}
