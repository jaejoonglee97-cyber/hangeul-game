import { InputListener } from './events.ts';
import { VisionModule, HandUpdate } from '../vision/index.ts';

const CLOSE_THRESHOLD = 40; // pixels – thumb-index distance to consider closed
const CLOSE_DURATION_MS = 150; // must stay closed for this long
const CATCH_COOLDOWN_MS = 500;

export class CameraAdapter {
  private vision: VisionModule;
  private listeners: InputListener[] = [];

  private cursorX = 0;
  private cursorY = 0;

  // gesture state
  private closeStartTime: number | null = null;
  private lastCatchTime = 0;
  private isClosed = false;
  private handVisible = false;

  constructor(vision: VisionModule) {
    this.vision = vision;
    this.vision.onHandUpdate(this.handleHandUpdate);
  }

  on(listener: InputListener): void {
    this.listeners.push(listener);
  }

  off(listener: InputListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  get isHandVisible(): boolean {
    return this.handVisible;
  }

  get position(): { x: number; y: number } {
    return { x: this.cursorX, y: this.cursorY };
  }

  private emit(event: Parameters<InputListener>[0]): void {
    this.listeners.forEach((l) => l(event));
  }

  private handleHandUpdate = (update: HandUpdate): void => {
    this.handVisible = update.handVisible;

    if (!update.handVisible) {
      if (this.isClosed) {
        this.isClosed = false;
        this.closeStartTime = null;
        this.emit({ type: 'release' });
      }
      return;
    }

    this.cursorX = update.cursorX;
    this.cursorY = update.cursorY;
    this.emit({ type: 'aim', x: this.cursorX, y: this.cursorY });

    const isNowClosed = update.thumbIndexDist < CLOSE_THRESHOLD;
    const now = Date.now();

    if (isNowClosed) {
      if (this.closeStartTime === null) {
        this.closeStartTime = now;
      } else if (
        !this.isClosed &&
        now - this.closeStartTime >= CLOSE_DURATION_MS &&
        now - this.lastCatchTime >= CATCH_COOLDOWN_MS
      ) {
        // confirmed catch
        this.isClosed = true;
        this.lastCatchTime = now;
        this.emit({ type: 'catch', x: this.cursorX, y: this.cursorY });
      }
    } else {
      this.closeStartTime = null;
      if (this.isClosed) {
        this.isClosed = false;
        this.emit({ type: 'release' });
      }
    }
  };

  destroy(): void {
    this.listeners = [];
  }
}
