const STORAGE_KEY = 'hangul-catch-progress';

export interface SessionSummary {
  date: string;
  totalQuestions: number;
  correctCount: number;
  durationMs: number;
}

export class ProgressStore {
  saveSession(summary: SessionSummary): void {
    try {
      const history = this.loadHistory();
      history.push(summary);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // localStorage unavailable – continue without persistence
    }
  }

  loadHistory(): SessionSummary[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as SessionSummary[];
    } catch {
      return [];
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
