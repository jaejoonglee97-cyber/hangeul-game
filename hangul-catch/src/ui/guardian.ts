export class GuardianScreen {
  readonly el: HTMLElement;
  onConfirm: (() => void) | null = null;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'screen guardian-screen';
    this.el.innerHTML = `
      <div class="notice-card">
        <div class="notice-icon">📷</div>
        <h1 class="notice-title">보호자님께</h1>
        <div class="notice-body">
          <p>
            이 게임은 아이의 손동작을 카메라로 인식해 화면 속 낱말 카드를 잡는 방식으로 진행됩니다.
          </p>
          <ul class="notice-list">
            <li>카메라 영상은 <strong>브라우저 안에서만</strong> 처리됩니다.</li>
            <li>영상이나 손 위치 정보는 <strong>저장하거나 서버로 전송하지 않습니다.</strong></li>
            <li>카메라를 사용하지 않아도 마우스나 터치로 즐길 수 있습니다.</li>
            <li>한 세션은 <strong>20문제</strong>로 구성됩니다.</li>
          </ul>
          <p class="notice-sub">계속하시면 위 내용에 동의한 것으로 간주합니다.</p>
        </div>
        <button class="btn-primary" id="guardian-confirm">계속하기</button>
      </div>
    `;

    this.el
      .querySelector('#guardian-confirm')!
      .addEventListener('click', () => {
        this.onConfirm?.();
      });
  }

  show(): void {
    this.el.classList.add('active');
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
