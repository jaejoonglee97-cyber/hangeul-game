export class SoundManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  playCorrect(): void {
    const ctx = this.getCtx();
    this.tone(ctx, 523.25, 0,    0.06, 0.18, 'triangle', 0.28);
    this.tone(ctx, 659.25, 0.09, 0.06, 0.18, 'triangle', 0.28);
    this.tone(ctx, 783.99, 0.18, 0.06, 0.24, 'triangle', 0.32);
  }

  playWrong(): void {
    const ctx = this.getCtx();
    this.tone(ctx, 240, 0,    0.04, 0.14, 'sawtooth', 0.18);
    this.tone(ctx, 190, 0.06, 0.04, 0.16, 'sawtooth', 0.12);
  }

  playSentenceComplete(): void {
    const ctx = this.getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => this.tone(ctx, f, i * 0.09, 0.06, 0.28, 'triangle', 0.28));
    // add a shimmer on top
    this.tone(ctx, 1318.5, 0.3, 0.06, 0.4, 'sine', 0.18);
  }

  playHintReveal(): void {
    const ctx = this.getCtx();
    this.tone(ctx, 440, 0,    0.04, 0.12, 'sine', 0.18);
    this.tone(ctx, 554, 0.08, 0.04, 0.18, 'sine', 0.15);
  }

  playGameComplete(): void {
    const ctx = this.getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => this.tone(ctx, f, i * 0.1, 0.07, 0.35, 'triangle', 0.28));
    // chord sustain at the end
    [523.25, 659.25, 783.99].forEach((f) =>
      this.tone(ctx, f, 0.55, 0.05, 0.8, 'sine', 0.15),
    );
  }

  private tone(
    ctx: AudioContext,
    freq: number,
    delay: number,
    attack: number,
    release: number,
    type: OscillatorType,
    volume: number,
  ): void {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
      osc.start(t);
      osc.stop(t + attack + release + 0.05);
    } catch {
      // audio context not available
    }
  }
}
