import {EnemyDetails, EnemyType, GameColor} from './sharedTypes';

export function getEnemyDetails(enemy: EnemyType): EnemyDetails {
  switch (enemy) {
    case EnemyType.Goblin:
      return {
        type: EnemyType.Goblin,
        name: 'Goblin',
        symbol: 'g',
        stats: {
          strength: 1,
          dexterity: 1,
          maxHp: 3,
        },
        xp: 1,
        dropPercentage: 10,
        color: GameColor.RED,
      };
    default: {
      throw new Error('Invalid enemy type');
    }
  }
  // SKELETON: {
  //   type: 'Skeleton',
  //   stats: {
  //     strength: 2,
  //     dexterity: 5,
  //     maxHp: 4,
  //   },
  //   xp: 3,
  //   dropPercentage: 5,
  //   color: GameColor.RED,
  // },
  // TROLL: {
  //   type: 'Troll',
  //   stats: {
  //     strength: 5,
  //     dexterity: 0,
  //     maxHp: 25,
  //   },
  //   xp: 10,
  //   dropPercentage: 30,
  //   color: GameColor.RED,
  // },
  // DRAGON: {
  //   type: 'Dragon',
  //   stats: {
  //     strength: 17,
  //     dexterity: 10,
  //     maxHp: 40,
  //   },
  //   xp: 30,
  //   dropPercentage: 80,
  //   color: GameColor.RED,
  // },
  // BALROG: {
  //   type: 'Balrog',
  //   stats: {
  //     strength: 25,
  //     dexterity: 40,
  //     maxHp: 80,
  //   },
  //   xp: 0,
  //   dropPercentage: 0,
  //   color: GameColor.ORANGE,
  // },
}
