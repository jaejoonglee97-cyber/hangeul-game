import { type Category, type CategoryInfo, CATEGORY_INFO } from '../game/words.ts';
import type { DifficultyLevel, GameStage } from '../game/index.ts';

const WORD_CATEGORIES: Category[] = ['all', 'nature', 'animals', 'food', 'daily', 'family', 'colors', 'places'];
const SENTENCE_CATEGORIES: Category[] = ['all', 'nature', 'animals', 'food', 'daily', 'family', 'places'];

const DIFFICULTY_INFO: Record<DifficultyLevel, { label: string; desc: string; color: string }> = {
  easy:   { label: '쉬움',   desc: '느린 카드 · 큰 글씨',  color: '#48bb78' },
  medium: { label: '보통',   desc: '중간 속도 · 보통 크기', color: '#ed8936' },
  hard:   { label: '어려움', desc: '빠른 카드 · 카드 4장',  color: '#e53e3e' },
};

const STAGE_INFO: Record<GameStage, { label: string; desc: string; icon: string }> = {
  word:     { label: '1단계 단어 잡기',  desc: '날아다니는 카드에서 빠진 글자를 잡아요!', icon: '🔤' },
  sentence: { label: '2단계 문장 완성',  desc: '문장의 빈칸을 순서대로 채워요!',          icon: '📝' },
};

export class StageSelectScreen {
  readonly el: HTMLElement;
  onStart: ((stage: GameStage, category: Category, difficulty: DifficultyLevel) => void) | null = null;

  private selectedStage: GameStage = 'word';
  private selectedCategory: Category = 'all';
  private selectedDifficulty: DifficultyLevel = 'easy';
  private modeBadgeEl!: HTMLElement;
  private categoryGridEl!: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'screen stage-select-screen';
    this.buildDOM();
  }

  private buildDOM(): void {
    const stageTabs = (Object.keys(STAGE_INFO) as GameStage[]).map((s) => {
      const info = STAGE_INFO[s];
      const active = s === this.selectedStage ? ' active' : '';
      return `
        <button class="stage-tab${active}" data-stage="${s}">
          <span class="stage-tab-icon">${info.icon}</span>
          <span class="stage-tab-label">${info.label}</span>
        </button>`;
    }).join('');

    const diffButtons = (Object.keys(DIFFICULTY_INFO) as DifficultyLevel[]).map((d) => {
      const info = DIFFICULTY_INFO[d];
      const active = d === this.selectedDifficulty ? ' selected' : '';
      return `
        <button class="diff-btn${active}" data-diff="${d}" style="--diff-color:${info.color}">
          <span class="diff-label">${info.label}</span>
          <span class="diff-desc">${info.desc}</span>
        </button>`;
    }).join('');

    this.el.innerHTML = `
      <div class="stage-select-wrap">
        <div class="stage-header">
          <div class="stage-mascot">🌸</div>
          <h1 class="stage-title">한글 잡기</h1>
          <p class="stage-subtitle">단계와 주제를 골라보세요!</p>
          <div class="stage-mode-badge" id="mode-badge">🖱️ 마우스 / 터치 모드</div>
        </div>

        <section class="section-block">
          <h2 class="section-heading">🎮 단계 선택</h2>
          <div class="stage-tabs" id="stage-tabs">
            ${stageTabs}
          </div>
          <p class="stage-desc" id="stage-desc">${STAGE_INFO[this.selectedStage].desc}</p>
        </section>

        <section class="section-block">
          <h2 class="section-heading">📚 주제 선택</h2>
          <div class="category-grid" id="category-grid"></div>
        </section>

        <section class="section-block">
          <h2 class="section-heading">⚡ 난이도 선택</h2>
          <div class="diff-row" id="diff-row">
            ${diffButtons}
          </div>
        </section>

        <button class="btn-primary btn-start-game" id="start-game-btn">
          시작하기 ▶
        </button>
      </div>
    `;

    this.modeBadgeEl   = this.el.querySelector('#mode-badge')!;
    this.categoryGridEl = this.el.querySelector('#category-grid')!;

    this.renderCategoryGrid();

    // Stage tab clicks
    this.el.querySelector('#stage-tabs')!.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-stage]') as HTMLElement | null;
      if (!btn) return;
      this.selectedStage = btn.dataset['stage'] as GameStage;
      this.el.querySelectorAll('.stage-tab').forEach((el) =>
        el.classList.toggle('active', (el as HTMLElement).dataset['stage'] === this.selectedStage),
      );
      const descEl = this.el.querySelector('#stage-desc')!;
      descEl.textContent = STAGE_INFO[this.selectedStage].desc;
      // reset category selection to 'all' and re-render grid
      this.selectedCategory = 'all';
      this.renderCategoryGrid();
    });

    // Difficulty buttons
    this.el.querySelector('#diff-row')!.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-diff]') as HTMLElement | null;
      if (!btn) return;
      this.selectedDifficulty = btn.dataset['diff'] as DifficultyLevel;
      this.el.querySelectorAll('.diff-btn').forEach((el) =>
        el.classList.toggle('selected', (el as HTMLElement).dataset['diff'] === this.selectedDifficulty),
      );
    });

    this.el.querySelector('#start-game-btn')!.addEventListener('click', () => {
      this.onStart?.(this.selectedStage, this.selectedCategory, this.selectedDifficulty);
    });
  }

  private renderCategoryGrid(): void {
    const categories = this.selectedStage === 'sentence' ? SENTENCE_CATEGORIES : WORD_CATEGORIES;
    this.categoryGridEl.innerHTML = categories.map((cat) => {
      const info: CategoryInfo = CATEGORY_INFO[cat];
      const active = cat === this.selectedCategory ? ' selected' : '';
      return `
        <button class="category-card${active}" data-category="${cat}">
          <span class="category-emoji">${info.emoji}</span>
          <span class="category-label">${info.label}</span>
          <span class="category-desc">${info.description}</span>
        </button>`;
    }).join('');

    this.categoryGridEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-category]') as HTMLElement | null;
      if (!btn) return;
      this.selectedCategory = btn.dataset['category'] as Category;
      this.categoryGridEl.querySelectorAll('.category-card').forEach((el) =>
        el.classList.toggle('selected', (el as HTMLElement).dataset['category'] === this.selectedCategory),
      );
    });
  }

  show(hasCamera: boolean): void {
    this.el.classList.add('active');
    if (hasCamera) {
      this.modeBadgeEl.textContent = '📷 카메라 손 인식 모드';
      this.modeBadgeEl.style.background = '#f0fff4';
      this.modeBadgeEl.style.borderColor = '#9ae6b4';
      this.modeBadgeEl.style.color = '#22543d';
    } else {
      this.modeBadgeEl.textContent = '🖱️ 마우스 / 터치 모드';
      this.modeBadgeEl.style.cssText = '';
    }
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
