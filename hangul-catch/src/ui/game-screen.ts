import {
  createRound,
  createSentenceRound,
  updateCardPositions,
  createInitialGameState,
  type Card,
  type RoundState,
  type WordRoundState,
  type SentenceRoundState,
  type GameState,
  type AttemptRecord,
  type DifficultyLevel,
  type GameStage,
} from '../game/index.ts';
import { getWordsByCategory, WORD_LIST, type Category, type WordEntry } from '../game/words.ts';
import { getSentencesByCategory, type SentenceEntry } from '../game/sentences.ts';
import { MouseTouchAdapter } from '../input/mouse.ts';
import { CameraAdapter } from '../input/camera.ts';
import { VisionModule } from '../vision/index.ts';
import type { InputEvent } from '../input/events.ts';
import { SoundManager } from '../audio/sounds.ts';

const TOTAL_ROUNDS = 20;
const TOTAL_SENTENCES = 10;
const HIT_EXPAND = 0.3;

export interface GameResult {
  correctCount: number;
  totalRounds: number;
  durationMs: number;
}

const CARD_COLORS = ['card-color-0', 'card-color-1', 'card-color-2', 'card-color-3'];

export class GameScreen {
  readonly el: HTMLElement;
  onComplete: ((result: GameResult) => void) | null = null;

  private playAreaEl!: HTMLElement;
  private feedbackEl!: HTMLElement;
  private progressEl!: HTMLElement;
  private difficultyEl!: HTMLElement;
  private handCursorEl!: HTMLElement;
  private noHandHintEl!: HTMLElement;
  private cameraPreviewWrapEl!: HTMLElement;
  private cameraPreviewVideoEl!: HTMLVideoElement;
  private cameraPreviewCanvasEl!: HTMLCanvasElement;
  private wordBoardEl!: HTMLElement;
  private sentenceBoardEl!: HTMLElement;
  private wordMeaningEl!: HTMLElement;

  private vision: VisionModule | null = null;
  private mouseAdapter: MouseTouchAdapter | null = null;
  private cameraAdapter: CameraAdapter | null = null;

  private gameState!: GameState;
  private roundState!: RoundState;
  private usedWordIds: Set<string> = new Set();
  private wordPool: WordEntry[] = [];
  private fixedDifficulty: DifficultyLevel = 'easy';
  private hasCamera = false;

  // sentence mode
  private gameStage: GameStage = 'word';
  private sentencePool: SentenceEntry[] = [];
  private usedSentenceIds: Set<string> = new Set();
  private currentSentence: SentenceEntry | null = null;
  private currentBlankIndex = 0;

  private sounds = new SoundManager();
  private wrongAttemptsThisRound = 0;

  private animFrameId = 0;
  private lastTimestamp = 0;
  private sessionStartMs = 0;

  private cursorX = 0;
  private cursorY = 0;
  private highlightedCardId: string | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;
  private roundTransitionPending = false;

  constructor(vision: VisionModule) {
    this.vision = vision;
    this.el = document.createElement('div');
    this.el.className = 'screen game-screen';
    this.buildDOM();
  }

  private buildDOM(): void {
    this.el.innerHTML = `
      <div class="game-header">
        <div class="progress-indicator" id="progress-indicator">1 / ${TOTAL_ROUNDS}</div>
        <div class="game-title" id="game-title">한글 잡기</div>
        <div class="difficulty-badge" id="difficulty-badge">쉬움</div>
      </div>

      <div class="word-board-wrap">
        <div class="word-board" id="word-board">
          <div class="syllable-slot" id="slot-0">?</div>
          <div class="syllable-slot" id="slot-1">?</div>
        </div>
        <div class="sentence-board" id="sentence-board" style="display:none"></div>
        <div class="word-meaning" id="word-meaning"></div>
        <div class="feedback-line" id="feedback-line"></div>
      </div>

      <div class="play-area" id="play-area">
        <div class="no-hand-hint" id="no-hand-hint">손을 화면 가운데로 보여주세요</div>
        <div class="hand-cursor" id="hand-cursor">
          <span class="hand-icon">🖐️</span>
        </div>
        <div class="camera-preview-wrap" id="camera-preview-wrap" style="display:none">
          <video class="camera-preview-video" id="camera-preview-video" autoplay muted playsinline></video>
          <canvas class="camera-preview-canvas" id="camera-preview-canvas"></canvas>
        </div>
      </div>
    `;

    this.playAreaEl        = this.el.querySelector('#play-area')!;
    this.feedbackEl        = this.el.querySelector('#feedback-line')!;
    this.progressEl        = this.el.querySelector('#progress-indicator')!;
    this.difficultyEl      = this.el.querySelector('#difficulty-badge')!;
    this.handCursorEl      = this.el.querySelector('#hand-cursor')!;
    this.noHandHintEl      = this.el.querySelector('#no-hand-hint')!;
    this.cameraPreviewWrapEl   = this.el.querySelector('#camera-preview-wrap')!;
    this.cameraPreviewVideoEl  = this.el.querySelector('#camera-preview-video')!;
    this.cameraPreviewCanvasEl = this.el.querySelector('#camera-preview-canvas')!;
    this.wordBoardEl       = this.el.querySelector('#word-board')!;
    this.sentenceBoardEl   = this.el.querySelector('#sentence-board')!;
    this.wordMeaningEl     = this.el.querySelector('#word-meaning')!;
  }

  start(hasCamera: boolean, stage: GameStage, category: Category, difficulty: DifficultyLevel): void {
    this.hasCamera = hasCamera;
    this.gameStage = stage;
    this.fixedDifficulty = difficulty;
    this.el.classList.add('active');

    if (stage === 'sentence') {
      this.sentencePool = getSentencesByCategory(category);
      if (this.sentencePool.length === 0) this.sentencePool = getSentencesByCategory('all');
      this.wordPool = WORD_LIST;
      this.wordBoardEl.style.display = 'none';
      this.sentenceBoardEl.style.display = '';
      const titleEl = this.el.querySelector('#game-title')!;
      titleEl.textContent = '문장 완성';
    } else {
      this.wordPool = getWordsByCategory(category);
      this.wordBoardEl.style.display = '';
      this.sentenceBoardEl.style.display = 'none';
      const titleEl = this.el.querySelector('#game-title')!;
      titleEl.textContent = '한글 잡기';
    }

    this.gameState = createInitialGameState();
    this.gameState.currentDifficulty = difficulty;
    this.usedWordIds = new Set();
    this.usedSentenceIds = new Set();
    this.currentSentence = null;
    this.currentBlankIndex = 0;
    this.sessionStartMs = Date.now();
    this.roundTransitionPending = false;

    if (hasCamera && this.vision) {
      this.cameraAdapter = new CameraAdapter(this.vision);
      this.cameraAdapter.on(this.handleInput);
      this.handCursorEl.classList.add('visible');
      this.attachCameraPreview();
    } else {
      this.mouseAdapter = new MouseTouchAdapter(this.playAreaEl);
      this.mouseAdapter.on(this.handleInput);
    }

    this.startRound();
    this.startLoop();
  }

  hide(): void {
    this.el.classList.remove('active');
    this.stopLoop();
    this.destroyAdapters();
    this.clearCards();
    this.cameraPreviewVideoEl.srcObject = null;
    this.cameraPreviewWrapEl.style.display = 'none';
    if (this.vision) this.vision.offHandUpdate(this.drawPreviewOverlay);
  }

  private attachCameraPreview(): void {
    if (!this.vision) return;
    const videoSrc = this.vision.getVideoElement();
    if (!videoSrc?.srcObject) return;
    this.cameraPreviewVideoEl.srcObject = videoSrc.srcObject as MediaStream;
    this.cameraPreviewWrapEl.style.display = 'block';
    this.vision.onHandUpdate(this.drawPreviewOverlay);
  }

  private drawPreviewOverlay = (): void => {
    const video = this.cameraPreviewVideoEl;
    const canvas = this.cameraPreviewCanvasEl;
    if (!video || video.readyState < 2) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
  };

  private destroyAdapters(): void {
    if (this.mouseAdapter) { this.mouseAdapter.destroy(); this.mouseAdapter = null; }
    if (this.cameraAdapter) { this.cameraAdapter.destroy(); this.cameraAdapter = null; }
  }

  private startRound(): void {
    this.roundTransitionPending = false;
    if (this.gameStage === 'sentence') {
      this.startSentenceRound();
    } else {
      this.startWordRound();
    }
  }

  private startWordRound(): void {
    this.wrongAttemptsThisRound = 0;
    const bounds = this.getPlayBounds();
    this.roundState = createRound(this.wordPool, this.gameState.currentDifficulty, this.usedWordIds, bounds);
    this.usedWordIds.add((this.roundState as WordRoundState).word.id);
    this.updateWordBoard(false);
    this.updateProgress();
    this.renderCards();
    this.clearFeedback();
  }

  private startSentenceRound(): void {
    this.roundTransitionPending = false;
    const bounds = this.getPlayBounds();

    // pick new sentence if needed
    if (!this.currentSentence) {
      const available = this.sentencePool.filter((s) => !this.usedSentenceIds.has(s.id));
      const pool = available.length > 0 ? available : this.sentencePool;
      this.currentSentence = pool[Math.floor(Math.random() * pool.length)];
      this.usedSentenceIds.add(this.currentSentence.id);
      this.currentBlankIndex = 0;
    }

    this.roundState = createSentenceRound(
      this.currentSentence,
      this.currentBlankIndex,
      this.wordPool,
      this.gameState.currentDifficulty,
      bounds,
    );
    this.renderSentenceBoard();
    this.updateProgress();
    this.renderCards();
    this.clearFeedback();
  }

  private getPlayBounds(): { width: number; height: number } {
    const rect = this.playAreaEl.getBoundingClientRect();
    return {
      width:  rect.width  || window.innerWidth,
      height: rect.height || window.innerHeight * 0.6,
    };
  }

  private updateWordBoard(filled: boolean): void {
    const state = this.roundState as WordRoundState;
    const { word, hiddenIndex } = state;

    const slot0 = this.el.querySelector('#slot-0')!;
    const slot1 = this.el.querySelector('#slot-1')!;

    slot0.textContent = hiddenIndex === 0 ? '?' : word.syllables[0];
    slot1.textContent = hiddenIndex === 1 ? '?' : word.syllables[1];

    slot0.className = 'syllable-slot' + (hiddenIndex === 0 && !filled ? ' missing' : '');
    slot1.className = 'syllable-slot' + (hiddenIndex === 1 && !filled ? ' missing' : '');

    if (filled) {
      slot0.textContent = word.syllables[0];
      slot1.textContent = word.syllables[1];
      (hiddenIndex === 0 ? slot0 : slot1).classList.add('filled');
    }

    // hint hidden until 3 wrong attempts
    if (!filled) {
      this.wordMeaningEl.textContent = '';
      this.wordMeaningEl.classList.remove('visible');
    }
  }

  private revealHint(): void {
    const state = this.roundState as WordRoundState;
    if (this.wordMeaningEl.classList.contains('visible')) return;
    this.wordMeaningEl.textContent = `힌트: ${state.word.emoji}  ${state.word.word}`;
    this.wordMeaningEl.classList.add('visible');
    this.sounds.playHintReveal();
  }

  private renderSentenceBoard(): void {
    const state = this.roundState as SentenceRoundState;
    const { sentence, blankIndex } = state;
    const filledCount = blankIndex; // how many blanks are already filled

    const parts = sentence.template.split('___');
    let html = '<div class="sentence-text">';
    parts.forEach((part, i) => {
      html += `<span class="sentence-part">${part}</span>`;
      if (i < parts.length - 1) {
        const answer = sentence.answers[i];
        if (i < filledCount) {
          html += `<span class="sentence-blank filled">${answer}</span>`;
        } else if (i === filledCount) {
          html += `<span class="sentence-blank current">?</span>`;
        } else {
          html += `<span class="sentence-blank future">___</span>`;
        }
      }
    });
    html += '</div>';

    const blankOrdinals = ['첫', '두', '세', '네'];
    const ordinal = blankOrdinals[blankIndex] ?? `${blankIndex + 1}`;
    html += `<div class="sentence-hint">${ordinal} 번째 빈칸을 채워요! ${sentence.emojis[blankIndex] ?? ''}</div>`;

    this.sentenceBoardEl.innerHTML = html;
  }

  private updateProgress(): void {
    const current = this.gameState.roundsDone + 1;
    if (this.gameStage === 'sentence') {
      this.progressEl.textContent = `문장 ${current} / ${TOTAL_SENTENCES}`;
    } else {
      this.progressEl.textContent = `${current} / ${TOTAL_ROUNDS}`;
    }
    const diffMap: Record<string, string> = { easy: '쉬움', medium: '보통', hard: '어려움' };
    this.difficultyEl.textContent = diffMap[this.gameState.currentDifficulty] ?? '쉬움';
  }

  private renderCards(): void {
    this.clearCards();
    const isSentenceMode = this.gameStage === 'sentence';
    this.roundState.cards.forEach((card, i) => {
      const el = this.createCardEl(card, i, isSentenceMode);
      this.playAreaEl.appendChild(el);
    });
  }

  private createCardEl(card: Card, colorIndex: number, wordCard = false): HTMLElement {
    const el = document.createElement('div');
    el.className = `card ${CARD_COLORS[colorIndex % CARD_COLORS.length]}${wordCard ? ' card-word' : ''}`;
    el.id = `card-${card.id}`;
    el.textContent = card.syllable;
    el.style.width  = `${card.width}px`;
    el.style.height = `${card.height}px`;
    el.style.left   = `${card.x}px`;
    el.style.top    = `${card.y}px`;
    return el;
  }

  private clearCards(): void {
    this.playAreaEl.querySelectorAll('.card').forEach((el) => el.remove());
  }

  private startLoop(): void {
    this.lastTimestamp = performance.now();
    const loop = (ts: number) => {
      this.animFrameId = requestAnimationFrame(loop);
      const dt = Math.min((ts - this.lastTimestamp) / 1000, 0.1);
      this.lastTimestamp = ts;
      this.update(dt);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = 0; }
  }

  private update(dt: number): void {
    if (this.roundTransitionPending) return;
    const bounds = this.getPlayBounds();
    this.roundState.cards = updateCardPositions(this.roundState.cards, dt, bounds);

    this.roundState.cards.forEach((card) => {
      const el = this.playAreaEl.querySelector(`#card-${card.id}`) as HTMLElement | null;
      if (!el) return;
      el.style.left = `${card.x}px`;
      el.style.top  = `${card.y}px`;
    });

    this.updateHighlight();
    if (this.hasCamera) this.updateHandCursor();
  }

  private updateHighlight(): void {
    const hovered = this.findCardUnderCursor(this.cursorX, this.cursorY);
    if (this.highlightedCardId !== (hovered?.id ?? null)) {
      if (this.highlightedCardId) {
        (this.playAreaEl.querySelector(`#card-${this.highlightedCardId}`) as HTMLElement | null)
          ?.classList.remove('highlight');
      }
      this.highlightedCardId = hovered?.id ?? null;
      if (this.highlightedCardId) {
        (this.playAreaEl.querySelector(`#card-${this.highlightedCardId}`) as HTMLElement | null)
          ?.classList.add('highlight');
      }
    }
  }

  private mapCamera(camX: number, camY: number): { x: number; y: number } {
    const bounds = this.getPlayBounds();
    return { x: (camX / 640) * bounds.width, y: (camY / 480) * bounds.height };
  }

  private updateHandCursor(): void {
    const adapter = this.cameraAdapter;
    if (!adapter) return;
    if (adapter.isHandVisible) {
      this.noHandHintEl.classList.remove('visible');
    } else {
      this.noHandHintEl.classList.add('visible');
    }
  }

  private findCardUnderCursor(x: number, y: number): Card | null {
    for (const card of this.roundState?.cards ?? []) {
      const expand = card.width * HIT_EXPAND;
      const halfW = card.width / 2 + expand / 2;
      const halfH = card.height / 2 + expand / 2;
      if (x >= card.x - halfW && x <= card.x + halfW && y >= card.y - halfH && y <= card.y + halfH) {
        return card;
      }
    }
    return null;
  }

  private handleInput = (event: InputEvent): void => {
    if (event.type === 'aim') {
      const { x, y } = this.hasCamera ? this.mapCamera(event.x, event.y) : { x: event.x, y: event.y };
      this.cursorX = x;
      this.cursorY = y;
      if (this.hasCamera) {
        this.handCursorEl.style.left = `${x}px`;
        this.handCursorEl.style.top  = `${y}px`;
        this.handCursorEl.classList.remove('closed');
      }
    } else if (event.type === 'catch') {
      const { x, y } = this.hasCamera ? this.mapCamera(event.x, event.y) : { x: event.x, y: event.y };
      if (this.hasCamera) {
        this.handCursorEl.classList.add('closed');
        const icon = this.handCursorEl.querySelector('.hand-icon');
        if (icon) icon.textContent = '✊';
      }
      this.processCatch(x, y);
    } else if (event.type === 'release') {
      if (this.hasCamera) {
        this.handCursorEl.classList.remove('closed');
        const icon = this.handCursorEl.querySelector('.hand-icon');
        if (icon) icon.textContent = '🖐️';
      }
    }
  };

  private processCatch(x: number, y: number): void {
    if (this.roundTransitionPending) return;
    const card = this.findCardUnderCursor(x, y);
    if (!card) return;

    const cardEl = this.playAreaEl.querySelector(`#card-${card.id}`) as HTMLElement | null;

    if (!card.isCorrect) {
      this.gameState.totalAttempts++;
      this.wrongAttemptsThisRound++;
      this.sounds.playWrong();
      cardEl?.classList.add('bouncing');
      setTimeout(() => cardEl?.classList.remove('bouncing'), 500);
      this.showFeedback('다시 잘 읽어봐요! 🤔');
      if (this.gameStage === 'word' && this.wrongAttemptsThisRound >= 3) {
        this.revealHint();
      }
      return;
    }

    // correct catch
    this.gameState.totalAttempts++;
    if (cardEl) cardEl.classList.add('caught');

    if (this.gameStage === 'sentence') {
      // sentence mode sets roundTransitionPending only on last blank
      this.processSentenceCatch();
    } else {
      this.roundTransitionPending = true;
      this.processWordCatch();
    }
  }

  private processWordCatch(): void {
    const state = this.roundState as WordRoundState;
    this.sounds.playCorrect();
    this.updateWordBoard(true);

    const record: AttemptRecord = {
      wordId: state.word.id,
      success: true,
      attempts: 1,
      reactionMs: Date.now() - state.startedAt,
      difficulty: this.gameState.currentDifficulty,
    };
    this.gameState.history.push(record);
    this.gameState.correctCount++;
    this.gameState.roundsDone++;
    this.gameState.currentDifficulty = this.fixedDifficulty;

    setTimeout(() => {
      if (this.gameState.roundsDone >= TOTAL_ROUNDS) {
        this.endSession();
      } else {
        this.startRound();
      }
    }, 700);
  }

  private processSentenceCatch(): void {
    const state = this.roundState as SentenceRoundState;
    const { sentence } = state;

    this.currentBlankIndex++;

    // update sentence board to show newly filled blank
    this.roundState = { ...state, blankIndex: this.currentBlankIndex } as SentenceRoundState;
    this.renderSentenceBoard();

    const isLastBlank = this.currentBlankIndex >= sentence.answers.length;

    if (isLastBlank) {
      this.sounds.playSentenceComplete();
      // freeze game until next sentence starts (show completion)
      this.roundTransitionPending = true;
      this.gameState.correctCount++;
      this.gameState.roundsDone++;
      this.gameState.currentDifficulty = this.fixedDifficulty;
      this.currentSentence = null;
      this.currentBlankIndex = 0;

      setTimeout(() => {
        if (this.gameState.roundsDone >= TOTAL_SENTENCES) {
          this.endSession();
        } else {
          this.startRound();
        }
      }, 800);
    } else {
      this.sounds.playCorrect();
      // blank-to-blank: briefly block input then respawn cards; keep cards moving
      this.roundTransitionPending = true;
      setTimeout(() => {
        this.startSentenceRound();
      }, 160);
    }
  }

  private showFeedback(msg: string): void {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedbackEl.textContent = msg;
    this.feedbackEl.classList.add('visible');
    this.feedbackTimeout = setTimeout(() => this.clearFeedback(), 2000);
  }

  private clearFeedback(): void {
    this.feedbackEl.textContent = '';
    this.feedbackEl.classList.remove('visible');
  }

  private endSession(): void {
    this.stopLoop();
    this.sounds.playGameComplete();
    const durationMs = Date.now() - this.sessionStartMs;
    const total = this.gameStage === 'sentence' ? TOTAL_SENTENCES : TOTAL_ROUNDS;
    this.onComplete?.({ correctCount: this.gameState.correctCount, totalRounds: total, durationMs });
  }
}
