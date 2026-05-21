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
          <div class="stage-header-row">
            <div class="stage-mode-badge" id="mode-badge">🖱️ 마우스 / 터치 모드</div>
            <button class="btn-guide" id="btn-guide">? 이용 가이드</button>
          </div>
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

      <!-- ── 이용 가이드 모달 ───────────────────────── -->
      <div class="guide-overlay" id="guide-overlay" style="display:none">
        <div class="guide-modal">
          <div class="guide-modal-header">
            <span class="guide-modal-title">📖 이용 가이드</span>
            <button class="guide-close-btn" id="guide-close">✕</button>
          </div>

          <div class="guide-modal-body">

            <div class="guide-intro-box">
              날아다니는 카드를 잡아 <strong>단어·문장을 완성</strong>하는 한글 학습 게임이에요!<br>
              대상: 한글을 배우는 <strong>6~7세 유아 · 초등 저학년</strong>
            </div>

            <div class="guide-section-label">🎮 게임 모드</div>
            <div class="guide-grid-2">
              <div class="guide-card guide-card-blue">
                <div class="gc-icon">🔤</div>
                <div class="gc-title">1단계 단어 잡기</div>
                <div class="gc-body">빠진 글자 카드를 잡아<br>단어를 완성해요</div>
                <div class="gc-example">구[?] → <strong>름</strong> 잡기!</div>
              </div>
              <div class="guide-card guide-card-purple">
                <div class="gc-icon">📝</div>
                <div class="gc-title">2단계 문장 완성</div>
                <div class="gc-body">빈칸 2개를 순서대로<br>단어 카드로 채워요</div>
                <div class="gc-example"><strong>하늘</strong> → <strong>구름</strong> 순서로!</div>
              </div>
            </div>

            <div class="guide-section-label">🕹️ 조작 방법</div>
            <div class="guide-grid-2">
              <div class="guide-card">
                <div class="gc-icon">🖱️</div>
                <div class="gc-title">마우스 / 터치</div>
                <div class="gc-body">카드를 클릭하거나 탭해요</div>
              </div>
              <div class="guide-card">
                <div class="gc-icon">📷</div>
                <div class="gc-title">카메라 손 인식</div>
                <div class="gc-body">손을 <strong>쥐는 동작</strong>으로 카드를 잡아요<br><small>영상은 기기 밖으로 전송 안 돼요</small></div>
              </div>
            </div>

            <div class="guide-section-label">⚡ 난이도</div>
            <div class="guide-grid-3">
              <div class="guide-diff-card" style="--dc:#48bb78">
                <strong>쉬움</strong><br>큰 카드 · 느리게 · 3장
              </div>
              <div class="guide-diff-card" style="--dc:#ed8936">
                <strong>보통</strong><br>보통 크기 · 보통 속도
              </div>
              <div class="guide-diff-card" style="--dc:#e53e3e">
                <strong>어려움</strong><br>작은 카드 · 빠르게 · 4장
              </div>
            </div>
            <div class="guide-hint-note">💡 3번 이상 틀리면 힌트가 자동으로 나와요!</div>

            <div class="guide-section-label">📚 주제 (7가지)</div>
            <div class="guide-topics-row">
              <span>🌿 자연</span><span>🐾 동물</span><span>🍎 음식</span>
              <span>🏠 생활</span><span>👨‍👩‍👧 가족</span><span>🎨 색깔</span><span>🚗 장소</span>
            </div>

            <div class="guide-section-label">🌟 기대 효과</div>
            <div class="guide-effects-grid">
              <div class="guide-effect-item">✅<span>음절 인식 능력</span></div>
              <div class="guide-effect-item">✅<span>어휘력 확장</span></div>
              <div class="guide-effect-item">✅<span>맞춤법 감각</span></div>
              <div class="guide-effect-item">✅<span>집중력·반응 속도</span></div>
              <div class="guide-effect-item">✅<span>신체·학습 통합</span></div>
              <div class="guide-effect-item">✅<span>성취감·자기효능감</span></div>
            </div>

            <div class="guide-section-label">💬 보호자 팁</div>
            <div class="guide-tips-list">
              <div class="guide-tip-item">🚀 처음엔 <strong>쉬움 + 동물·음식</strong> 주제로 시작해요</div>
              <div class="guide-tip-item">🗣️ 카드 잡기 전에 <strong>소리 내어 읽게</strong> 해보세요</div>
              <div class="guide-tip-item">⏱️ 1세션 약 <strong>5~10분</strong> (단어 20문제 / 문장 10문제)</div>
            </div>

          </div>
        </div>
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

    const guideOverlay = this.el.querySelector('#guide-overlay') as HTMLElement;
    this.el.querySelector('#btn-guide')!.addEventListener('click', () => {
      guideOverlay.style.display = 'flex';
    });
    this.el.querySelector('#guide-close')!.addEventListener('click', () => {
      guideOverlay.style.display = 'none';
    });
    guideOverlay.addEventListener('click', (e) => {
      if (e.target === guideOverlay) guideOverlay.style.display = 'none';
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
