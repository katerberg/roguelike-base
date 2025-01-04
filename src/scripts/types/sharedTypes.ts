import {MapLevel} from '../logicalObjects/MapLevel';

export type DungeonMap = {
  currentLevel: number;
  levels: {[level: number]: MapLevel};
};

export enum TileOption {
  Grass = 20,
  Ladder = 126,
  Wall = 205,
}

export type NumberCoordinates = {x: number; y: number};
export type Coordinate = `${number},${number}`;
