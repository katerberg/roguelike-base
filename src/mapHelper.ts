import {DungeonMap} from '../types/sharedTypes';
import {MapLevel} from './MapLevel';

export function generateMap(): DungeonMap {
  const dungeonMap: DungeonMap = {
    levels: [],
  };
  for (let levelNumber = 0; levelNumber < 10; levelNumber++) {
    dungeonMap.levels[levelNumber] = new MapLevel({levelNumber});
  }
  return dungeonMap;
}
