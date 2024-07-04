import 'regenerator-runtime/runtime';
import {Display, FOV, RNG, Scheduler} from 'rot-js';
import SchedulerType from 'rot-js/lib/scheduler/scheduler';
import * as tinycolor from 'tinycolor2';
// import {v4 as uuid} from 'uuid';
import {Actor} from '../types/Actor';
import {colors, dimensions, symbols} from '../types/constants';
import {Cell, Coordinate, DungeonMap, MapLevel, VisibilityStatus} from '../types/sharedTypes';
import {generateMap} from './mapHelper';
import {Player} from './Player';

export class Game {
  display: Display;

  dungeonMap!: DungeonMap;

  player!: Player;

  devMode: boolean;

  level!: number;

  scheduler!: SchedulerType<Actor>;

  constructor() {
    this.display = new Display({width: dimensions.WIDTH, height: dimensions.HEIGHT});
    this.devMode = window.location.href.indexOf('devmode') > -1;
    this.resetAll();
    const container = this.display.getContainer();
    if (container) {
      document.body.appendChild(container);
    }
  }

  resetAll(): void {
    this.level = 0;
    this.scheduler = new Scheduler.Simple();
    this.dungeonMap = generateMap();
    this.drawWalls();
    this.populatePlayer();
    this.init();
  }

  drawWalls(): void {
    for (let i = 0; i < dimensions.WIDTH; i++) {
      for (let j = 1; j < dimensions.HEIGHT; j++) {
        if (this.currentLevel.cells[`${i},${j}`].visibilityStatus === VisibilityStatus.Unseen) {
          this.display.draw(i, j, symbols.WALL, null, null);
        }
      }
    }
  }

  get currentLevel(): MapLevel {
    return this.dungeonMap.levels[this.level];
  }

  // eslint-disable-next-line class-methods-use-this
  isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < dimensions.WIDTH && y >= 0 && y < dimensions.HEIGHT;
  }

  isFreeOfStandingPlayers(x: number, y: number): boolean {
    return !this.player || this.player.x !== x || this.player.y !== y;
  }

  isFreeCell(x: number, y: number): boolean {
    // const level = mapLevel !== undefined ? mapLevel : this.currentLevel;
    return (
      this.isValidCoordinate(x, y) &&
      // (!game.dungeonMap?.[level] ||
      //   this.currentLevel.monsters.every((monster) => monster.x !== x || monster.y !== y)) &&
      this.isFreeOfStandingPlayers(x, y) &&
      this.currentLevel.cells[`${x},${y}`].isPassable
    );
  }

  get freeCells(): Cell[] {
    return Object.values(this.currentLevel.cells).filter((cell) => this.isFreeCell(cell.x, cell.y));
  }

  popOpenFreeSpace(): Cell {
    const index = Math.floor(RNG.getUniform() * this.freeCells.length);
    return this.freeCells.splice(index, 1)[0];
  }

  createActor<T extends Actor>(
    ActorClass: {new (game: Game, x: number, y: number, ...params: unknown[]): T},
    params = [],
  ): T {
    const {x, y} = this.popOpenFreeSpace();
    return new ActorClass(this, x, y, ...params);
  }

  populatePlayer(): void {
    this.player = this.createActor(Player);
    this.scheduler.add(this.player, true);
  }

  lightPasses(x: number, y: number): boolean {
    return this.currentLevel.cells[`${x},${y}`]?.isPassable;
  }

  redrawSpace(x: number, y: number, faded: boolean): void {
    let symbol = symbols.OPEN;
    let color = colors.FADED_WHITE;
    const keyFormat: Coordinate = `${x},${y}`;
    if (this.player.x === x && this.player.y === y) {
      symbol = symbols.PLAYER;
      color = colors.YELLOW;
      // } else if (!faded && this.enemies.find((e) => e.x === x && e.y === y)) {
      //   const enemy = this.enemies.find((e) => e.x === x && e.y === y);
      //   ({color, symbol} = enemy);
      // } else if (this.caches[keyFormat]) {
      //   symbol = symbols[this.caches[keyFormat].type.toUpperCase()];
      //   color = colors.GREEN;
      // } else if (this.exit.matches(keyFormat)) {
      //   symbol = symbols.LADDER;
      //   color = colors.WHITE;
    } else if (!this.currentLevel.cells[keyFormat]) {
      symbol = symbols.WALL;
      color = colors.WHITE;
    }
    color = faded ? tinycolor(color).darken(30).toString() : color;
    this.display.draw(x, y, symbol, color, null);
  }

  drawFov(): void {
    // const currentRun = uuid();
    const fov = new FOV.PreciseShadowcasting(this.lightPasses.bind(this));
    fov.compute(this.player.x, this.player.y, 500, (x, y) => {
      const key: Coordinate = `${x},${y}`;
      this.currentLevel.cells[key].visibilityStatus = VisibilityStatus.Visible;
      this.redrawSpace(x, y, this.currentLevel.cells[key].visibilityStatus !== VisibilityStatus.Visible);
    });
    // Object.keys(this.seenSpaces)
    //   .filter((s) => this.seenSpaces[s] !== currentRun)
    //   .forEach((s) => {
    //     const [x, y] = s.split(',').map((c) => parseInt(c, 10));
    //     this.redrawSpace(x, y, true);
    //   });
  }

  async nextTurn(): Promise<boolean> {
    const actor: Actor = this.scheduler.next();
    if (!actor) {
      return false;
    }
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    this.drawWalls();
    this.player.draw();
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good) {
        break;
      }
    }
  }
}
