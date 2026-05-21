import { VisionModule } from './vision/index.ts';
import { ProgressStore } from './progress/index.ts';
import { GuardianScreen } from './ui/guardian.ts';
import { CameraSetupScreen } from './ui/camera-setup.ts';
import { StageSelectScreen } from './ui/stage-select.ts';
import { GameScreen } from './ui/game-screen.ts';
import { CompletionScreen } from './ui/completion.ts';

export class AppController {
  private root: HTMLElement;

  private vision: VisionModule;
  private progress: ProgressStore;

  private guardianScreen: GuardianScreen;
  private cameraSetupScreen: CameraSetupScreen;
  private stageSelectScreen: StageSelectScreen;
  private gameScreen: GameScreen;
  private completionScreen: CompletionScreen;

  private hasCamera = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.vision = new VisionModule();
    this.progress = new ProgressStore();

    this.guardianScreen = new GuardianScreen();
    this.cameraSetupScreen = new CameraSetupScreen(this.vision);
    this.stageSelectScreen = new StageSelectScreen();
    this.gameScreen = new GameScreen(this.vision);
    this.completionScreen = new CompletionScreen();

    [
      this.guardianScreen.el,
      this.cameraSetupScreen.el,
      this.stageSelectScreen.el,
      this.gameScreen.el,
      this.completionScreen.el,
    ].forEach((el) => this.root.appendChild(el));

    this.wireCallbacks();
  }

  run(): void {
    this.guardianScreen.show();
  }

  private wireCallbacks(): void {
    // Guardian → Camera Setup
    this.guardianScreen.onConfirm = () => {
      this.guardianScreen.hide();
      void this.cameraSetupScreen.show();
    };

    // Camera Setup → Stage Select
    this.cameraSetupScreen.onReady = (hasCamera: boolean) => {
      this.hasCamera = hasCamera;
      this.cameraSetupScreen.hide();
      this.stageSelectScreen.show(hasCamera);
    };

    // Stage Select → Game
    this.stageSelectScreen.onStart = (stage, category, difficulty) => {
      this.stageSelectScreen.hide();
      this.gameScreen.start(this.hasCamera, stage, category, difficulty);
    };

    // Game → Stage Select (back button)
    this.gameScreen.onBack = () => {
      this.stageSelectScreen.show(this.hasCamera);
    };

    // Game → Completion
    this.gameScreen.onComplete = (result) => {
      this.progress.saveSession({
        date: new Date().toISOString(),
        totalQuestions: result.totalRounds,
        correctCount: result.correctCount,
        durationMs: result.durationMs,
      });
      this.gameScreen.hide();
      this.completionScreen.show(result);
    };

    // Completion → Stage Select (replay)
    this.completionScreen.onReplay = () => {
      this.completionScreen.hide();
      this.stageSelectScreen.show(this.hasCamera);
    };
  }
}
