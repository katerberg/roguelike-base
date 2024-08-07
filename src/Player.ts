import {DIRS, RNG} from 'rot-js';
import {Actor} from '../types/Actor';
import {Combatant} from '../types/Combatant';
import {MovementKey, getMovement, isValidKey, isMovementKey, modalChoices} from '../types/keymaps';
import {Game} from './Game';
import {Modal} from './Modal';

export class Player implements EventListenerObject, Actor, Combatant {
  // eslint-disable-next-line class-methods-use-this
  resolver: () => void = () => {};

  game: Game;

  x: number;

  y: number;

  currentHp: number;

  xp: number;

  stats: {strength: number; dexterity: number; maxHp: number};

  type = 'Player' as const;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.stats = {
      maxHp: 5,
      strength: 1,
      dexterity: 1,
    };
    this.currentHp = this.stats.maxHp;
  }

  get isDead(): boolean {
    return this.currentHp <= 0;
  }

  get damage(): number {
    const modifier = 0;
    // const modifier = this.gear.Weapon ? this.gear.Weapon.modifier : 0;
    return this.stats.strength + modifier;
  }

  addXp(xp: number): void {
    this.xp += xp;
  }

  releaseInput(): void {
    window.removeEventListener('keydown', this);
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
    const [xChange, yChange] = DIRS[4][getMovement(key)];
    const newX = this.x + xChange;
    const newY = this.y + yChange;
    if (
      !this.game.currentLevel.isValidCoordinate(newX, newY) ||
      !this.game.currentLevel.cells[`${newX},${newY}`].isPassable
    ) {
      return;
    }
    const enemyInSpace = this.game.currentLevel.getEnemyAt(`${newX},${newY}`);
    if (enemyInSpace) {
      enemyInSpace.takeDamage(this.damage, this);
      return this.resolver();
    }
    this.draw(newX, newY);
    const cell = this.game.currentLevel.cells[`${this.x},${this.y}`];
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
    //       if (res === 'true') {
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
    // } else
    if (cell.isExit) {
      const nextLevelResponse = this.buildModalCallback((res?: string) => {
        if (res === 'true') {
          this.game.nextLevel();
        }
      });
      new Modal(this.game.display, nextLevelResponse, 'Are you ready to delve deeper?', 20, 20, 5, modalChoices.yn);
    } else {
      this.resolver();
    }
  }

  buildModalCallback(callback?: (res?: string) => void): (res?: string) => void {
    this.releaseInput();
    return (res?) => {
      if (callback) {
        callback(res);
      }

      this.game.rebuild();
      this.listenForInput();
    };
  }

  handleEvent(evt: KeyboardEvent): void {
    const {key} = evt;
    if (key === 'q' && this.game.devMode) {
      this.game.nextLevel();
    }
    // if (key === 'e' && this.game.devMode) {
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

  calculateDamage(incomingDamage: number, source: Combatant): number {
    const dexDiff = this.stats.dexterity - source.stats.dexterity;
    if (RNG.getPercentage() < dexDiff) {
      return 0;
    }
    // if (this.gear.Armor) {
    //   const percent = RNG.getPercentage() / 100;
    //   const damage = Math.ceil(incomingDamage - this.gear.Armor.modifier * percent);
    //   if (damage < 0) {
    //     return 0;
    //   }
    //   return damage;
    // }

    return incomingDamage;
  }

  takeDamage(incomingDamage: number, source: Combatant): void {
    const damage = this.calculateDamage(incomingDamage, source);
    // if (damage === null) {
    //   this.game.sendMessage(`You dodged the attack from a ${enemy.type.toLowerCase()}`);
    // } else if (damage === 0) {
    //   this.game.sendMessage(`Your armor absorbed all the damage from a ${enemy.type.toLowerCase()}`);
    // } else {
    //   this.game.sendMessage(`A ${enemy.type.toLowerCase()} hit you for ${damage} damage`);
    // }
    this.currentHp -= damage;
    if (this.currentHp <= 0) {
      this.currentHp = 0;
    }
    this.draw();
    if (this.currentHp === 0) {
      this.releaseInput();
      this.game.loseGame(source);
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
