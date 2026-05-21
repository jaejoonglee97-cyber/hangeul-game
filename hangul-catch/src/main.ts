import './style.css';
import { AppController } from './app.ts';

const app = new AppController(document.getElementById('app')!);
app.run();
