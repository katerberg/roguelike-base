import {DIRS} from 'rot-js';
import {Actor} from '../types/Actor';
// import {movementKeymap, validKeymap} from '../types/constants';
import {MovementKey, getMovement, ValidKey, isValidKey, isMovementKey} from '../types/keymaps';
import {Game} from './Game';

export class Player implements EventListenerObject, Actor {
  // eslint-disable-next-line class-methods-use-this
  resolver: () => void = () => {};

  game: Game;

  x: number;

  y: number;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
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

  handleMovement(key: MovementKey): void {
    // const foo = movementKeymap[key];
    const [xChange, yChange] = DIRS[4][getMovement(key)];
    const newX = this.x + xChange;
    const newY = this.y + yChange;
    // const newSpace = `${newX},${newY}`;
    if (!this.game.isValidCoordinate(newX, newY)) {
      return;
    }
    // const enemyInSpace = this.game.getEnemyAt(newSpace);
    // if (enemyInSpace) {
    //   enemyInSpace.takeDamage(this.getDamage(), this);
    //   return this.resolver();
    // }
    this.draw(newX, newY);
    // const contents = this.game.retrieveContents(this.coordinates);
    // if (contents instanceof Cache) {
    //   if (contents.type === 'Potion') {
    //     this.game.sendMessage(`Tastes awful, but heals ${contents.modifiers.hp}.`);
    //     this.currentHp += contents.modifiers.hp;
    //     if (this.currentHp > this.effectiveMaxHp) {
    //       this.currentHp = this.effectiveMaxHp;
    //     }
    //     this.game.removeCache(this.coordinates);
    //     this.drawHp();
    //     this.resolver();
    //   } else {
    //     const pickupResponse = this.buildModalCallback((res) => {
    //       if (res) {
    //         this.game.removeCache(this.coordinates);
    //         this.equip(contents);
    //       }
    //       this.resolver();
    //     });
    //     new Modal(
    //       this.game.display,
    //       pickupResponse,
    //       `${contents.display}. Would you like to equip it?`,
    //       20,
    //       20,
    //       5,
    //       modalChoices.yn,
    //     );
    //   }
    // } else if (contents instanceof Ladder) {
    //   const nextLevelResponse = this.buildModalCallback((res) => {
    //     if (res) {
    //       this.game.nextLevel();
    //     }
    //   });
    //   new Modal(this.game.display, nextLevelResponse, 'Are you ready to delve deeper?', 20, 20, 5, modalChoices.yn);
    // } else {
    this.resolver();
    // }
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
    if (!isValidKey(key)) {
      if (this.game.devMode) {
        console.log(`Key is ${key}`); // eslint-disable-line no-console
      }
    }
    // this.game.clearMessage();
    if (isMovementKey(key)) {
      this.handleMovement(key);
      // } else if (validKeymap[keyCode] === 'Menu') {
      //   this.handleOpenMenu();
      // } else if (validKeymap[keyCode] === 'Gear') {
      //   this.handleOpenInventory();
    }
  }

  draw(x?: number, y?: number): void {
    const oldX = this.x;
    const oldY = this.y;
    this.x = x || oldX;
    this.y = y || oldY;
    this.game.drawFov();
    // this.drawHp();
  }
}
