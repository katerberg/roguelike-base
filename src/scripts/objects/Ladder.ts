import {CELL_WIDTH} from '../types/constants';
import {TileOption} from '../types/sharedTypes';

export default class Ladder extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x * CELL_WIDTH, y * CELL_WIDTH, 'batch1', TileOption.Ladder);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
