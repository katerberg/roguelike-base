// import {RNG} from 'rot-js';
import {v4 as uuid} from 'uuid';
// import Cache from './Cache';
// import {enemies} from '../types/constants';
import {Actor} from '../types/Actor';
import {GameColor} from '../types/sharedTypes';
import {Game} from './Game';

export class Enemy implements Actor {
  id: string;

  x: number;

  y: number;

  // name: string;

  // type: string;

  // xp: number;

  // color: string;

  // item: Cache | null;

  currentHp: number;

  // symbol: string;

  game: Game;

  // stats: {
  //   strength: number;
  //   dexterity: number;
  //   maxHp: number;
  // };

  constructor(
    game: Game,
    x: number,
    y: number,
    // enemy: any,
    // name: string,
  ) {
    this.game = game;
    this.id = uuid();
    this.x = x;
    this.y = y;
    // this.name = name;
    // this.type = enemy.type;
    // [this.symbol] = this.type.split('');
    // this.stats = {
    //   ...enemy.stats,
    // };
    // this.xp = enemy.xp;
    // this.item =
    //   enemy.dropPercentage > RNG.getPercentage() ? new Cache(this.game.level, 'Potion', 'healer', 0, 0, this.xp) : null;
    // this.color = enemy.color;
    // this.currentHp = this.stats.maxHp;
    this.currentHp = 3;
  }

  get color(): GameColor {
    return GameColor.RED;
  }

  get symbol(): string {
    return 'g';
  }

  // get coordinates() {
  //   return `${this.x},${this.y}`;
  // }

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

  // isEnemyInSpace(x, y) {
  //   return this.game.enemies.filter((e) => e.id !== this.id && e.x === x && e.y === y).length;
  // }

  act(): Promise<() => void> {
    // const playerX = this.game.player.x;
    // const playerY = this.game.player.y;
    // const {path} = this;
    // if (path[0] && !this.isEnemyInSpace(path[0][0], path[0][1])) {
    //   const [[nextX, nextY]] = path;
    //   if (nextX === playerX && nextY === playerY) {
    //     console.log('attack');
    //     // this.game.player.takeDamage(this.stats.strength, this);
    //   } else {
    // this.draw(nextX, nextY);
    this.draw(this.x, this.y);
    //   }
    // }
    return Promise.resolve(() => {});
  }

  draw(x?: number, y?: number): void {
    const newX = x || this.x;
    const newY = y || this.y;
    this.x = newX;
    this.y = newY;
    this.game.drawFov();
  }

  // calculateDamage(incomingDamage, source) {
  //   const dexDiff = this.stats.dexterity - source.stats.dexterity;
  //   if (RNG.getPercentage() < dexDiff) {
  //     return 0;
  //   }
  //   return incomingDamage;
  // }

  // takeDamage(incomingDamage, source) {
  //   const damage = this.calculateDamage(incomingDamage, source);
  //   this.currentHp -= damage;
  //   if (this.currentHp <= 0) {
  //     this.game.removeEnemy(this);
  //     source.addXp(this.xp);
  //     if (this.type === enemies.BALROG.type) {
  //       source.releaseInput();
  //       this.game.winGame();
  //     }
  //   }
  // }
}
