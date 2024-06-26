import {Actor} from '../types/Actor';
import {validKeymap} from '../types/constants';
import {Game} from './Game';

export class Player implements EventListenerObject, Actor {
  // eslint-disable-next-line class-methods-use-this
  resolver: () => void = () => {};

  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  listenForInput(): void {
    window.addEventListener('keydown', this);
  }

  act(): Promise<() => void> {
    return new Promise((resolve) => {
      this.listenForInput();
      this.resolver = resolve as () => void;
    });
  }

  handleEvent(evt: KeyboardEvent): void {
    const {key} = evt;
    // if (keyCode === 81 && this.game.devmode) {
    //   // Q
    //   this.game.nextLevel();
    // }
    // if (keyCode === 69 && this.game.devmode) {
    //   // E
    //   this.levelUp();
    // }
    if (!(key in validKeymap)) {
      if (this.game.devMode) {
        console.log(`Key is ${key}`); // eslint-disable-line no-console
      }
    }
    // this.game.clearMessage();
    // if (keyCode in movementKeymap) {
    //   this.handleMovement(keyCode);
    // } else if (validKeymap[keyCode] === 'Menu') {
    //   this.handleOpenMenu();
    // } else if (validKeymap[keyCode] === 'Gear') {
    //   this.handleOpenInventory();
    // }
  }
}
