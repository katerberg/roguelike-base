import {EnemyType} from './sharedTypes';

export interface Combatant {
  stats: {
    strength: number;
    dexterity: number;
    maxHp: number;
  };
  addXp(xp: number): void;
  type: EnemyType | 'Player';
}
