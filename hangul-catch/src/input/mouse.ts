import { InputListener } from './events.ts';

export class MouseTouchAdapter {
  private container: HTMLElement;
  private listeners: InputListener[] = [];
  private isDown = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.attach();
  }

  on(listener: InputListener): void {
    this.listeners.push(listener);
  }

  off(listener: InputListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emit(event: Parameters<InputListener>[0]): void {
    this.listeners.forEach((l) => l(event));
  }

  private getRelativeCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.container.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private onMouseMove = (e: MouseEvent): void => {
    const { x, y } = this.getRelativeCoords(e.clientX, e.clientY);
    this.emit({ type: 'aim', x, y });
  };

  private onMouseDown = (e: MouseEvent): void => {
    this.isDown = true;
    const { x, y } = this.getRelativeCoords(e.clientX, e.clientY);
    this.emit({ type: 'catch', x, y });
  };

  private onMouseUp = (_e: MouseEvent): void => {
    if (this.isDown) {
      this.isDown = false;
      this.emit({ type: 'release' });
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = this.getRelativeCoords(touch.clientX, touch.clientY);
    this.emit({ type: 'aim', x, y });
  };

  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    this.isDown = true;
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = this.getRelativeCoords(touch.clientX, touch.clientY);
    this.emit({ type: 'catch', x, y });
  };

  private onTouchEnd = (_e: TouchEvent): void => {
    if (this.isDown) {
      this.isDown = false;
      this.emit({ type: 'release' });
    }
  };

  private attach(): void {
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.container.addEventListener('touchend', this.onTouchEnd);
  }

  destroy(): void {
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchend', this.onTouchEnd);
    this.listeners = [];
  }
}
