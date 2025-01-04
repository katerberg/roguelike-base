import {Map, RNG} from 'rot-js';
import {CELL_WIDTH, dimensions} from '../types/constants';
// import {Cell, CellType, Coordinate, EnemyType, NumberCoordinates, VisibilityStatus} from '../types/sharedTypes';
import {Coordinate, TileOption} from '../types/sharedTypes';
// import {Enemy} from './Enemy';
// import {Game} from './Game';
// import {Ladder} from './Ladder';
// import {coordsToNumberCoords} from './math';

import MainScene from '../scenes/mainScene';
import Cell from '../objects/Cell';
import {Player} from '../objects/Player';

export class MapLevel {
  levelNumber: number;

  game: MainScene;
  player: Player;

  // enemies: Enemy[];

  cells: {
    [key: Coordinate]: Cell;
  };

  constructor({levelNumber, game}: {game: MainScene; levelNumber: number}) {
    this.levelNumber = levelNumber;
    this.game = game;
    // this.enemies = [];
    this.cells = {};

    // for (let y = 0; y < dimensions.HEIGHT; y++) {
    //   for (let x = 0; x < dimensions.WIDTH; x++) {
    //     this.cells[`${x},${y}`] = {
    //       x,
    //       y,
    //       isEntrance: false,
    //       isExit: false,
    //       isPassable: false,
    //       isWalkable: false,
    //       type: CellType.Wall,
    //       visibilityStatus: VisibilityStatus.Unseen,
    //       items: [],
    //     };
    //   }
    // }

    const digger = new Map.Digger(Math.ceil(dimensions.WIDTH - 50 + Math.pow(levelNumber, 2) / 2), dimensions.HEIGHT, {
      dugPercentage: levelNumber * 0.1,
      corridorLength: [0, 5],
    });

    const digCallback = (x: number, y: number, value: number): void => {
      if (value) {
        return;
      }

      const key: Coordinate = `${x},${y}`;
      this.cells[key] = new Cell(this.game, x, y, TileOption.Grass);
    };
    digger.create(digCallback);

    this.addExitLadder();
    const playerCell = this.getRandomCellMatching(
      (cell) => this.isValidCoordinate(cell.x / CELL_WIDTH, cell.y / CELL_WIDTH) && cell.isPassable && !cell.isExit,
    );
    if (playerCell) {
      this.player = new Player({scene: this.game, x: playerCell.x / CELL_WIDTH, y: playerCell.y / CELL_WIDTH, hp: 100});
    }
    // this.addAllEnemies();
  }

  get exit(): Cell | undefined {
    return Object.values(this.cells).find((cell) => cell.isExit);
  }

  // eslint-disable-next-line class-methods-use-this
  isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < dimensions.WIDTH && y >= 0 && y < dimensions.HEIGHT;
  }

  isFreeCell(x: number, y: number): boolean {
    return (
      this.isValidCoordinate(x, y) &&
      // && this.enemies.every((enemy) => enemy.x !== x || enemy.y !== y) &&
      // this.isFreeOfStandingPlayers(x, y) &&
      this.cells[`${x},${y}`].isPassable
    );
  }

  getRandomCellMatching(matchingFunction: (cell: Cell) => boolean): Cell | undefined {
    const matchingCells = Object.values(this.cells).filter(matchingFunction);

    return matchingCells[Math.floor(RNG.getUniform() * matchingCells.length)];
  }

  get freeCell(): Cell {
    const index = Math.floor(RNG.getUniform() * this.freeCells.length);
    return this.freeCells.slice(index, index + 1)[0];
  }
  get freeCells(): Cell[] {
    return Object.values(this.cells).filter((cell) => this.isFreeCell(cell.x / CELL_WIDTH, cell.y / CELL_WIDTH));
  }

  // isTransparentCell = (x: number, y: number): boolean =>
  //   this.isValidCoordinate(x, y) && this.cells[`${x},${y}`].isPassable;

  // isFreeOfStandingPlayers(x: number, y: number): boolean {
  //   return !this.game.player || this.game.player.x !== x || this.game.player.y !== y;
  // }

  // isEnemyInSpace(x: number, y: number, idToIgnore?: string): boolean {
  //   return this.enemies.filter((e) => e.x === x && e.y === y && e.id !== idToIgnore).length > 0;
  // }

  // getEnemyAt(key: Coordinate): Enemy | null {
  //   const {x, y} = coordsToNumberCoords(key);
  //   return this.enemies.filter((e) => e.x === x && e.y === y)[0] ?? null;
  // }

  // addAllEnemies(): void {
  //   const freeSpace = this.popOpenFreeSpace();

  //   this.enemies.push(new Enemy(this.game, freeSpace.x, freeSpace.y, EnemyType.Goblin));
  // }

  // removeEnemy(enemy: Enemy): void {
  //   this.game.scheduler.remove(enemy);
  //   this.enemies = this.enemies.filter((e) => e.id !== enemy.id);
  //   this.game.drawFov();
  // }

  addExitLadder(): void {
    const ladderCell = this.freeCell;
    this.cells[`${ladderCell.x / CELL_WIDTH},${ladderCell.y / CELL_WIDTH}`].makeExit();
  }

  // calculatePath(
  //   start: NumberCoordinates,
  //   targetX: number,
  //   targetY: number,
  //   pathableFunction: (x: number, y: number, game: Game) => boolean,
  // ): Coordinate[] {
  //   //a star
  //   const aStar = new Path.AStar(
  //     targetX,
  //     targetY,
  //     (astarX: number, astarY: number): boolean =>
  //       (astarX === start.x && astarY === start.y) || pathableFunction(astarX, astarY, this.game),
  //   );
  //   const path: Coordinate[] = [];
  //   aStar.compute(start.x, start.y, (computeX, computeY) => {
  //     path.push(`${computeX},${computeY}`);
  //   });
  //   if (path.length > 0) {
  //     path.shift();
  //   }
  //   return path;
  // }
}
