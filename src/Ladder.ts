import {Coordinate} from '../types/sharedTypes';
import {coordsToNumberCoords} from './math';

export class Ladder {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  matches(keyFormat: Coordinate): boolean {
    const {x, y} = coordsToNumberCoords(keyFormat);
    return this.x === x && this.y === y;
  }
}
