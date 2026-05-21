import type { GameResult } from './game-screen.ts';

const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🌸', '🎉'];

export class CompletionScreen {
  readonly el: HTMLElement;
  onReplay: (() => void) | null = null;

  private scoreNumberEl!: HTMLElement;
  private subtitleEl!: HTMLElement;
  private starsContainerEl!: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'screen completion-screen';
    this.el.innerHTML = `
      <div class="completion-card">
        <div class="completion-stars" id="completion-stars"></div>
        <div class="completion-emoji" id="completion-emoji">🎊</div>
        <h1 class="completion-title">잘했어요!</h1>
        <p class="completion-subtitle" id="completion-subtitle">오늘도 열심히 했어요!</p>

        <div class="score-display">
          <div>
            <div style="display:flex; align-items:baseline; gap:4px;">
              <span class="score-number" id="score-number">0</span>
              <span class="score-divider">/</span>
              <span class="score-total">20</span>
            </div>
            <div class="score-label">맞힌 문제</div>
          </div>
        </div>

        <div class="completion-actions">
          <button class="btn-primary btn-large" id="replay-btn">다시 하기 🔄</button>
        </div>
      </div>
    `;

    this.scoreNumberEl = this.el.querySelector('#score-number')!;
    this.subtitleEl = this.el.querySelector('#completion-subtitle')!;
    this.starsContainerEl = this.el.querySelector('#completion-stars')!;

    this.el.querySelector('#replay-btn')!.addEventListener('click', () => {
      this.onReplay?.();
    });
  }

  show(result: GameResult): void {
    this.el.classList.add('active');
    this.scoreNumberEl.textContent = String(result.correctCount);

    // Emoji and subtitle based on score
    const emojiEl = this.el.querySelector('#completion-emoji')!;
    const rate = result.correctCount / result.totalRounds;
    if (rate >= 0.9) {
      emojiEl.textContent = '🏆';
      this.subtitleEl.textContent = '완벽해요! 정말 대단해요!';
    } else if (rate >= 0.7) {
      emojiEl.textContent = '🎊';
      this.subtitleEl.textContent = '잘했어요! 더 잘할 수 있어요!';
    } else if (rate >= 0.5) {
      emojiEl.textContent = '🌸';
      this.subtitleEl.textContent = '열심히 했어요! 계속 연습해요!';
    } else {
      emojiEl.textContent = '🌱';
      this.subtitleEl.textContent = '처음이라 어렵죠? 다시 해봐요!';
    }

    this.spawnStars();
  }

  hide(): void {
    this.el.classList.remove('active');
    this.starsContainerEl.innerHTML = '';
  }

  private spawnStars(): void {
    this.starsContainerEl.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.textContent = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 2}s`;
      star.style.fontSize = `${14 + Math.random() * 14}px`;
      this.starsContainerEl.appendChild(star);
    }
  }
}
