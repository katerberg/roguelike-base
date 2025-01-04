import {TileOption} from '../types/sharedTypes';

const CELL_WIDTH = 32;
export default class Cell extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, image: TileOption) {
    super(scene, x * CELL_WIDTH, y * CELL_WIDTH, 'batch1', image);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
