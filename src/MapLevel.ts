import {Map, Path, RNG} from 'rot-js';
import {dimensions} from '../types/constants';
import {Cell, CellType, Coordinate, EnemyType, NumberCoordinates, VisibilityStatus} from '../types/sharedTypes';
import {Enemy} from './Enemy';
import {Game} from './Game';
import {Ladder} from './Ladder';

export class MapLevel {
  levelNumber: number;

  game: Game;

  enemies: Enemy[];

  exits: Ladder[];

  cells: {
    [key: Coordinate]: Cell;
  };

  constructor({levelNumber, game}: {game: Game; levelNumber: number}) {
    this.levelNumber = levelNumber;
    this.game = game;
    this.exits = [];
    this.enemies = [];
    this.cells = {};

    for (let y = 0; y < dimensions.HEIGHT; y++) {
      for (let x = 0; x < dimensions.WIDTH; x++) {
        this.cells[`${x},${y}`] = {
          x,
          y,
          isEntrance: false,
          isExit: false,
          isPassable: false,
          isWalkable: false,
          type: CellType.Wall,
          visibilityStatus: VisibilityStatus.Unseen,
          items: [],
        };
      }
    }

    const digger = new Map.Digger(Math.ceil(dimensions.WIDTH - 50 + Math.pow(levelNumber, 2) / 2), dimensions.HEIGHT, {
      dugPercentage: levelNumber * 0.1,
      // dugPercentage: 0.9,
      corridorLength: [0, 5],
    });

    const digCallback = (x: number, y: number, value: number): void => {
      if (value) {
        return;
      }

      const key: Coordinate = `${x},${y}`;
      this.cells[key] = {
        x,
        y,
        isEntrance: false,
        isExit: false,
        isPassable: true,
        isWalkable: true,
        type: CellType.Earth,
        visibilityStatus: VisibilityStatus.Unseen,
        items: [],
      };
    };
    digger.create(digCallback);

    this.addExitLadder();
    this.addAllEnemies();
  }

  // eslint-disable-next-line class-methods-use-this
  isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < dimensions.WIDTH && y >= 0 && y < dimensions.HEIGHT;
  }

  isFreeCell(x: number, y: number): boolean {
    return (
      this.isValidCoordinate(x, y) &&
      this.enemies.every((enemy) => enemy.x !== x || enemy.y !== y) &&
      this.isFreeOfStandingPlayers(x, y) &&
      this.cells[`${x},${y}`].isPassable
    );
  }

  isFreeOfStandingPlayers(x: number, y: number): boolean {
    return !this.game.player || this.game.player.x !== x || this.game.player.y !== y;
  }

  isEnemyInSpace(x: number, y: number, idToIgnore?: string): boolean {
    return this.enemies.filter((e) => e.x === x && e.y === y && e.id !== idToIgnore).length > 0;
  }

  addAllEnemies(): void {
    const freeSpace = this.popOpenFreeSpace();

    this.enemies.push(new Enemy(this.game, freeSpace.x, freeSpace.y, EnemyType.Goblin));
  }

  removeEnemy(enemy: Enemy): void {
    this.game.scheduler.remove(enemy);
    this.enemies = this.enemies.filter((e) => e.id !== enemy.id);
    this.game.drawFov();
  }

  popOpenFreeSpace(): Cell {
    const index = Math.floor(RNG.getUniform() * this.freeCells.length);
    return this.freeCells.slice(index, index + 1)[0];
  }

  addExitLadder(): void {
    const ladderCell = this.popOpenFreeSpace();
    this.cells[`${ladderCell.x},${ladderCell.y}`].isExit = true;
    this.cells[`${ladderCell.x},${ladderCell.y}`].type = CellType.Exit;
    ladderCell.type = CellType.Exit;
    this.exits.push(new Ladder(ladderCell.x, ladderCell.y));
  }

  calculatePath(
    start: NumberCoordinates,
    targetX: number,
    targetY: number,
    pathableFunction: (x: number, y: number, game: Game) => boolean,
  ): Coordinate[] {
    //a star
    const aStar = new Path.AStar(
      targetX,
      targetY,
      (astarX: number, astarY: number): boolean =>
        (astarX === start.x && astarY === start.y) || pathableFunction(astarX, astarY, this.game),
    );
    const path: Coordinate[] = [];
    aStar.compute(start.x, start.y, (computeX, computeY) => {
      path.push(`${computeX},${computeY}`);
    });
    if (path.length > 0) {
      path.shift();
    }
    return path;
  }

  get freeCells(): Cell[] {
    return Object.values(this.cells).filter((cell) => this.isFreeCell(cell.x, cell.y));
  }
}
