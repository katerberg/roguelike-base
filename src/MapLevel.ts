import {Cell, Coordinate} from '../types/sharedTypes';
import {Ladder} from './Ladder';

export class MapLevel {
  exits: Ladder[];

  cells: {
    [key: Coordinate]: Cell;
  };

  constructor() {
    this.exits = [];
    this.cells = {};
  }
}
