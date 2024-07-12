import {Cell, Coordinate} from '../types/sharedTypes';
import {Ladder} from './Ladder';

export class MapLevel {
  playerSpawn: Coordinate;

  exits: Ladder[];

  cells: {
    [key: Coordinate]: Cell;
  };

  constructor() {
    this.exits = [];
  }
}
