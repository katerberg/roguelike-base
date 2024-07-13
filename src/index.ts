import './index.scss';
import {Game} from './Game';

const game = new Game();

if (window.location.href.indexOf('devmode') > -1) {
  globalThis.gameState = game;
}
