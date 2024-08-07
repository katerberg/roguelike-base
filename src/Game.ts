import 'regenerator-runtime/runtime';
import {Display, FOV, Scheduler} from 'rot-js';
import SchedulerType from 'rot-js/lib/scheduler/scheduler';
import * as tinycolor from 'tinycolor2';
import {Actor} from '../types/Actor';
import {Combatant} from '../types/Combatant';
import {dimensions, MAX_LEVEL, symbols} from '../types/constants';
import {getEnemyDetails} from '../types/enemies';
import {modalChoices} from '../types/keymaps';
import {CellType, Coordinate, DungeonMap, GameColor, VisibilityStatus} from '../types/sharedTypes';
import {logMessage} from './logging';
import {MapLevel} from './MapLevel';
import {coordsToNumberCoords} from './math';
import {Modal} from './Modal';
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

    this.dungeonMap = {
      levels: [],
    };
    for (let levelNumber = 0; levelNumber <= MAX_LEVEL; levelNumber++) {
      this.dungeonMap.levels[levelNumber] = new MapLevel({levelNumber, game: this});
    }
    this.dungeonMap.levels.forEach((level) => {
      level.exits = [];
    });
    this.drawWalls();
    this.populatePlayer();
    this.currentLevel.enemies.forEach((enemy) => this.scheduler.add(enemy, true));
    this.init();
  }

  rebuild(): void {
    this.drawWalls();
    this.currentLevel.exits.forEach((exit) => {
      this.display.draw(exit.x, exit.y, symbols.LADDER, GameColor.WHITE, null);
    });
    this.player.draw();
    this.currentLevel.enemies.forEach((e) => e.draw());
  }

  nextLevel(): void {
    if (this.level === MAX_LEVEL) {
      return;
    }
    this.level += 1;
    this.scheduler.clear();
    this.scheduler.add(this.player, true);
    this.currentLevel.enemies.forEach((enemy) => this.scheduler.add(enemy, true));
    if (!this.currentLevel.isFreeCell(this.player.x, this.player.y)) {
      const cell = this.currentLevel.popOpenFreeSpace();
      this.player.draw(cell.x, cell.y);
    }
    this.drawWalls();
    this.drawFov();
  }

  drawWalls(): void {
    for (let i = 0; i < dimensions.WIDTH; i++) {
      for (let j = 0; j < dimensions.HEIGHT; j++) {
        if (this.currentLevel.cells[`${i},${j}`].visibilityStatus === VisibilityStatus.Unseen) {
          this.display.draw(i, j, symbols.WALL, null, null);
        }
      }
    }
  }

  get currentLevel(): MapLevel {
    return this.dungeonMap.levels[this.level];
  }

  createActor<T extends Actor>(
    ActorClass: {new (game: Game, x: number, y: number, ...params: unknown[]): T},
    params = [],
  ): T {
    const {x, y} = this.currentLevel.popOpenFreeSpace();
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
    let color: GameColor | string = GameColor.FADED_WHITE;
    const keyFormat: Coordinate = `${x},${y}`;
    if (this.player.x === x && this.player.y === y) {
      symbol = symbols.PLAYER;
      color = GameColor.YELLOW;
    } else if (!faded && this.currentLevel.enemies.find((e) => e.x === x && e.y === y)) {
      const enemy = this.currentLevel.enemies.find((e) => e.x === x && e.y === y)!;
      ({color, symbol} = enemy);
      // } else if (this.caches[keyFormat]) {
      //   symbol = symbols[this.caches[keyFormat].type.toUpperCase()];
      //   color = GameColor.GREEN;
    } else if (this.currentLevel.cells[keyFormat].type === CellType.Exit) {
      symbol = symbols.LADDER;
      color = GameColor.WHITE;
    } else if (this.currentLevel.cells[keyFormat].type === CellType.Wall) {
      symbol = symbols.WALL;
      color = GameColor.WHITE;
    }
    color = faded ? tinycolor(color).darken(30).toString() : color;
    this.display.draw(x, y, symbol, color, null);
  }

  drawFov(): void {
    if (this.player.isDead) {
      return;
    }
    const fov = new FOV.PreciseShadowcasting(this.lightPasses.bind(this));
    const seenThisRun: {[cellKey: Coordinate]: boolean} = {};
    fov.compute(this.player.x, this.player.y, 500, (x, y) => {
      const key: Coordinate = `${x},${y}`;
      seenThisRun[key] = true;
      this.currentLevel.cells[key].visibilityStatus = VisibilityStatus.Visible;
      this.redrawSpace(x, y, this.currentLevel.cells[key].visibilityStatus !== VisibilityStatus.Visible);
    });
    (Object.keys(this.currentLevel.cells) as Coordinate[]).forEach((key) => {
      if (!seenThisRun[key]) {
        const numberCoordinates = coordsToNumberCoords(key);
        // Ensure previously seen items are drawn faded
        if (this.currentLevel.cells[key].visibilityStatus === VisibilityStatus.Seen) {
          this.redrawSpace(numberCoordinates.x, numberCoordinates.y, true);
          // Clean up previously visible items
        } else if (this.currentLevel.cells[key].visibilityStatus === VisibilityStatus.Visible) {
          this.currentLevel.cells[key].visibilityStatus = VisibilityStatus.Seen;
          this.redrawSpace(numberCoordinates.x, numberCoordinates.y, true);
        }
      }
    });
  }

  playAgainCallback(res: string): void {
    this.resetAll();
    if (res === 'false') {
      console.log('done');
      // this.player.handleOpenMenu();
    }
  }

  loseGame(source: Combatant): void {
    // this.storeState(true);
    this.scheduler.clear();
    const text = `You have lost after taking a brutal blow from a roaming ${source.type === 'Player' ? 'Player' : getEnemyDetails(source.type).name}.\n\nWould you like to play again?`;
    new Modal(this.display, this.playAgainCallback.bind(this), text, 40, 20, 5, modalChoices.yn);
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
