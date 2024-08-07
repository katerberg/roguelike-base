import {FOV, RNG} from 'rot-js';
import {v4 as uuid} from 'uuid';
import {Actor} from '../types/Actor';
import {Combatant} from '../types/Combatant';
import {getEnemyDetails} from '../types/enemies';
import {Coordinate, EnemyType, GameColor} from '../types/sharedTypes';
import {Game} from './Game';
import {logMessage} from './logging';
import {coordsToNumberCoords} from './math';

export class Enemy implements Actor, Combatant {
  id: string;

  x: number;

  y: number;

  xp: number;

  viewRange: number;

  type: EnemyType;

  color: GameColor;

  currentHp: number;

  symbol: string;

  game: Game;

  target: Coordinate | null;

  stats: {
    strength: number;
    dexterity: number;
    maxHp: number;
  };

  constructor(game: Game, x: number, y: number, type: EnemyType) {
    this.game = game;
    this.id = uuid();
    this.x = x;
    this.y = y;
    this.type = type;
    const details = getEnemyDetails(type);
    this.xp = details.xp;
    this.symbol = details.symbol;
    this.viewRange = details.stats.viewRange;
    this.stats = {
      ...details.stats,
    };
    this.target = null;
    this.color = details.color;
    this.currentHp = this.stats.maxHp;
  }

  addXp(xp: number): void {
    this.xp += xp;
  }

  get coordinates(): Coordinate {
    return `${this.x},${this.y}`;
  }

  // get path() {
  //   const aStarCallback = (x, y) => `${x},${y}` in this.game.map;
  //   const topology = this.type === 'Troll' ? 4 : 8;
  //   const aStar = new Path.AStar(this.game.player.x, this.game.player.y, aStarCallback, {topology});
  //   const path = [];
  //   const pathCallback = (x, y) => path.push([x, y]);
  //   aStar.compute(this.x, this.y, pathCallback);
  //   path.shift();
  //   return path;
  // }
  isMonsterPathableCell(x: number, y: number): boolean {
    return (
      this.game.currentLevel.isValidCoordinate(x, y) &&
      this.game.currentLevel.enemies.every((enemy) => enemy.x !== x || enemy.y !== y) &&
      this.game.currentLevel.cells[`${x},${y}`].isPassable
    );
  }

  act(): Promise<() => void> {
    this.setTargetIfNeeded();
    if (!this.target) {
      return Promise.resolve(() => {});
    }
    const {x, y} = coordsToNumberCoords(this.target);
    const playerCoordinates = {x: this.game.player.x, y: this.game.player.y};
    if (
      playerCoordinates.x === x &&
      playerCoordinates.y === y &&
      Math.abs(x - this.x) <= 1 &&
      Math.abs(y - this.y) <= 1
    ) {
      this.attackPlayer();
    } else {
      const path = this.game.currentLevel.calculatePath(
        {x: this.x, y: this.y},
        x,
        y,
        this.isMonsterPathableCell.bind(this),
      );
      if (path.length > 0) {
        const {x: newX, y: newY} = coordsToNumberCoords(path[0]);
        this.x = newX;
        this.y = newY;
      }
    }

    this.draw(this.x, this.y);
    return Promise.resolve(() => {});
  }

  attackPlayer(): void {
    const damage = this.stats.strength;
    this.game.player.takeDamage(damage, this);
  }

  isPlayerInView(): boolean {
    const viewLines = new FOV.PreciseShadowcasting(this.game.currentLevel.isTransparentCell);

    let playerInView = false;

    viewLines.compute(this.x, this.y, this.viewRange, (x, y) => {
      if (this.game.player.x === x && this.game.player.y === y) {
        playerInView = true;
      }
    });
    return playerInView;
  }

  setTargetIfNeeded(): void {
    if (this.isPlayerInView()) {
      this.target = `${this.game.player.x},${this.game.player.y}`;
    }
  }

  draw(x?: number, y?: number): void {
    const newX = x || this.x;
    const newY = y || this.y;
    this.x = newX;
    this.y = newY;
    this.game.drawFov();
  }

  calculateDamage(incomingDamage: number, source: Combatant): number {
    const dexDiff = this.stats.dexterity - source.stats.dexterity;
    if (RNG.getPercentage() < dexDiff) {
      return 0;
    }
    return incomingDamage;
  }

  takeDamage(incomingDamage: number, source: Combatant): void {
    const damage = this.calculateDamage(incomingDamage, source);
    this.currentHp -= damage;
    logMessage(`You hit ${getEnemyDetails(this.type).name} for ${damage} damage.`);
    if (this.currentHp <= 0) {
      this.game.currentLevel.removeEnemy(this);
      source.addXp(this.xp);
      // if (this.type === enemies.BALROG.type) {
      //   source.releaseInput();
      //   this.game.winGame();
      // }
    }
  }
}
