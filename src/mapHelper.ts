import {Map} from 'rot-js';
import {dimensions} from '../types/constants';
import {CellType, Coordinate, DungeonMap, VisibilityStatus} from '../types/sharedTypes';

export function generateMap(): DungeonMap {
  const dungeonMap: DungeonMap = {
    levels: [],
  };
  for (let levelNumber = 0; levelNumber < 10; levelNumber++) {
    dungeonMap.levels[levelNumber] = {cells: {}, exits: [], playerSpawn: '0,0'};
    for (let y = 0; y < dimensions.HEIGHT; y++) {
      for (let x = 0; x < dimensions.WIDTH; x++) {
        dungeonMap.levels[levelNumber].cells[`${x},${y}`] = {
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
      dungeonMap.levels[levelNumber].cells[key] = {
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
  return dungeonMap;
}
