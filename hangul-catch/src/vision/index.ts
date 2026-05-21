import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision';

export interface HandUpdate {
  cursorX: number;
  cursorY: number;
  thumbIndexDist: number;
  handVisible: boolean;
}

type HandUpdateCallback = (update: HandUpdate) => void;

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

export class VisionModule {
  private handLandmarker: HandLandmarker | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private animFrameId = 0;
  private callbacks: HandUpdateCallback[] = [];
  private lastVideoTime = -1;

  async init(): Promise<boolean> {
    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      return true;
    } catch {
      return false;
    }
  }

  async startCamera(videoEl: HTMLVideoElement): Promise<boolean> {
    if (!this.handLandmarker) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      this.videoEl = videoEl;
      videoEl.srcObject = stream;
      videoEl.setAttribute('playsinline', 'true');

      await new Promise<void>((resolve) => {
        videoEl.onloadeddata = () => resolve();
      });
      await videoEl.play();

      this.startDetectionLoop();
      return true;
    } catch {
      return false;
    }
  }

  stop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
    if (this.videoEl?.srcObject) {
      const stream = this.videoEl.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      this.videoEl.srcObject = null;
    }
  }

  onHandUpdate(cb: HandUpdateCallback): void {
    this.callbacks.push(cb);
  }

  offHandUpdate(cb: HandUpdateCallback): void {
    this.callbacks = this.callbacks.filter((c) => c !== cb);
  }

  private notifyCallbacks(update: HandUpdate): void {
    this.callbacks.forEach((cb) => cb(update));
  }

  private startDetectionLoop(): void {
    const detect = () => {
      this.animFrameId = requestAnimationFrame(detect);

      const video = this.videoEl;
      if (!video || !this.handLandmarker) return;
      if (video.readyState < 2) return;
      if (video.currentTime === this.lastVideoTime) return;

      this.lastVideoTime = video.currentTime;

      let result: HandLandmarkerResult;
      try {
        result = this.handLandmarker.detectForVideo(video, performance.now());
      } catch {
        return;
      }

      if (!result.landmarks || result.landmarks.length === 0) {
        this.notifyCallbacks({
          cursorX: 0,
          cursorY: 0,
          thumbIndexDist: 999,
          handVisible: false,
        });
        return;
      }

      const landmarks = result.landmarks[0];
      const vw = video.videoWidth || video.clientWidth;
      const vh = video.videoHeight || video.clientHeight;

      // landmark indices: wrist=0, thumb_tip=4, index_tip=8
      const indexTip = landmarks[8];
      const thumbTip = landmarks[4];

      // mirror x for selfie view
      const cursorX = (1 - indexTip.x) * vw;
      const cursorY = indexTip.y * vh;

      const dx = (thumbTip.x - indexTip.x) * vw;
      const dy = (thumbTip.y - indexTip.y) * vh;
      const thumbIndexDist = Math.sqrt(dx * dx + dy * dy);

      this.notifyCallbacks({
        cursorX,
        cursorY,
        thumbIndexDist,
        handVisible: true,
      });
    };

    this.animFrameId = requestAnimationFrame(detect);
  }
}
