import { VisionModule } from './vision/index.ts';
import { ProgressStore } from './progress/index.ts';
import { GuardianScreen } from './ui/guardian.ts';
import { CameraSetupScreen } from './ui/camera-setup.ts';
import { ChildStartScreen } from './ui/child-start.ts';
import { GameScreen } from './ui/game-screen.ts';
import { CompletionScreen } from './ui/completion.ts';

type ScreenName = 'guardian' | 'camera-setup' | 'child-start' | 'game' | 'completion';

export class AppController {
  private root: HTMLElement;

  private vision: VisionModule;
  private progress: ProgressStore;

  private guardianScreen: GuardianScreen;
  private cameraSetupScreen: CameraSetupScreen;
  private childStartScreen: ChildStartScreen;
  private gameScreen: GameScreen;
  private completionScreen: CompletionScreen;

  private hasCamera = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.vision = new VisionModule();
    this.progress = new ProgressStore();

    this.guardianScreen = new GuardianScreen();
    this.cameraSetupScreen = new CameraSetupScreen(this.vision);
    this.childStartScreen = new ChildStartScreen();
    this.gameScreen = new GameScreen(this.vision);
    this.completionScreen = new CompletionScreen();

    // Mount all screens
    [
      this.guardianScreen.el,
      this.cameraSetupScreen.el,
      this.childStartScreen.el,
      this.gameScreen.el,
      this.completionScreen.el,
    ].forEach((el) => this.root.appendChild(el));

    this.wireCallbacks();
  }

  run(): void {
    this.showScreen('guardian');
  }

  private showScreen(name: ScreenName): void {
    const map: Record<ScreenName, HTMLElement> = {
      guardian: this.guardianScreen.el,
      'camera-setup': this.cameraSetupScreen.el,
      'child-start': this.childStartScreen.el,
      game: this.gameScreen.el,
      completion: this.completionScreen.el,
    };

    Object.values(map).forEach((el) => el.classList.remove('active'));
    map[name].classList.add('active');
  }

  private wireCallbacks(): void {
    // Guardian → Camera Setup
    this.guardianScreen.onConfirm = () => {
      this.showScreen('camera-setup');
      void this.cameraSetupScreen.show();
    };

    // Camera Setup → Child Start
    this.cameraSetupScreen.onReady = (hasCamera: boolean) => {
      this.hasCamera = hasCamera;
      this.cameraSetupScreen.hide();
      this.childStartScreen.show(hasCamera);
    };

    // Child Start → Game
    this.childStartScreen.onStart = () => {
      this.childStartScreen.hide();
      this.gameScreen.start(this.hasCamera);
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

    // Completion → restart
    this.completionScreen.onReplay = () => {
      this.completionScreen.hide();
      this.hasCamera = false;

      // Restart from guardian notice
      this.showScreen('guardian');
    };
  }
}
