export class ChildStartScreen {
  readonly el: HTMLElement;
  onStart: (() => void) | null = null;

  private modeBadgeEl: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'screen child-start-screen';
    this.el.innerHTML = `
      <div class="start-card">
        <div class="start-mascot">🌸</div>
        <h1 class="start-title">한글 잡기</h1>
        <p class="start-subtitle">낱말 카드를 잡아봐요!</p>
        <div class="start-session-info">20문제</div>
        <br>
        <div class="start-mode-badge" id="mode-badge">🖱️ 마우스 / 터치 모드</div>
        <br><br>
        <button class="btn-primary btn-large" id="start-btn">시작하기 ▶</button>
      </div>
    `;

    this.modeBadgeEl = this.el.querySelector('#mode-badge')!;
    this.el.querySelector('#start-btn')!.addEventListener('click', () => {
      this.onStart?.();
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
    }
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
