import './index.scss';
import {Game as PhaserGame} from 'phaser';
import {Game} from './Game';

const game = new Game();
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: game,
};

new PhaserGame(config);

if (window.location.href.indexOf('devmode') > -1) {
  globalThis.gameState = game;
}
