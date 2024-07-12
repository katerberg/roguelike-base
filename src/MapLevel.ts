import {Map} from 'rot-js';
import {dimensions} from '../types/constants';
import {Cell, CellType, Coordinate, VisibilityStatus} from '../types/sharedTypes';
import {Ladder} from './Ladder';

export class MapLevel {
  levelNumber: number;

  exits: Ladder[];

  cells: {
    [key: Coordinate]: Cell;
  };

  constructor({levelNumber}: {levelNumber: number}) {
    this.levelNumber = levelNumber;
    this.exits = [];
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
      // dugPercentage: levelNumber * 0.1,
      dugPercentage: 0.9,
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
  }
}
