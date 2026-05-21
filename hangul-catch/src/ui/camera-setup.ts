import { VisionModule } from '../vision/index.ts';

export class CameraSetupScreen {
  readonly el: HTMLElement;
  onReady: ((hasCamera: boolean) => void) | null = null;

  private vision: VisionModule;
  private videoEl: HTMLVideoElement;
  private statusEl: HTMLElement;
  private skipBtn: HTMLButtonElement;
  private continueBtn: HTMLButtonElement;

  constructor(vision: VisionModule) {
    this.vision = vision;
    this.el = document.createElement('div');
    this.el.className = 'screen camera-setup-screen';
    this.el.innerHTML = `
      <div class="setup-card">
        <h2 class="setup-title">카메라 준비</h2>
        <div class="video-preview-wrap">
          <video class="video-preview" autoplay muted playsinline></video>
          <div class="video-overlay" id="camera-overlay">
            <div class="camera-status" id="camera-status">카메라를 확인하는 중...</div>
          </div>
        </div>
        <div class="setup-actions">
          <button class="btn-secondary" id="camera-skip">카메라 없이 하기</button>
          <button class="btn-primary hidden" id="camera-continue">시작하기</button>
        </div>
        <p class="setup-hint">손을 화면에 비추면 손 인식이 시작됩니다.</p>
      </div>
    `;

    this.videoEl = this.el.querySelector('.video-preview')!;
    this.statusEl = this.el.querySelector('#camera-status')!;
    this.skipBtn = this.el.querySelector('#camera-skip')!;
    this.continueBtn = this.el.querySelector('#camera-continue')!;

    this.skipBtn.addEventListener('click', () => {
      this.vision.stop();
      this.onReady?.(false);
    });

    this.continueBtn.addEventListener('click', () => {
      this.onReady?.(true);
    });
  }

  async show(): Promise<void> {
    this.el.classList.add('active');
    this.statusEl.textContent = '카메라 권한을 요청하는 중...';

    const initOk = await this.vision.init();
    if (!initOk) {
      this.setStatus('손 인식 모듈을 불러오지 못했습니다. 마우스/터치로 진행할 수 있습니다.', 'error');
      return;
    }

    const cameraOk = await this.vision.startCamera(this.videoEl);
    if (!cameraOk) {
      this.setStatus('카메라를 사용할 수 없습니다. 마우스/터치로 진행할 수 있습니다.', 'error');
      return;
    }

    this.setStatus('카메라 연결 완료! 손을 화면에 비춰보세요.', 'success');
    this.continueBtn.classList.remove('hidden');
    this.skipBtn.textContent = '카메라 없이 하기';
  }

  hide(): void {
    this.el.classList.remove('active');
  }

  private setStatus(msg: string, type: 'info' | 'success' | 'error'): void {
    this.statusEl.textContent = msg;
    this.statusEl.className = `camera-status status-${type}`;
  }
}
