import {CELL_WIDTH} from '../types/constants';
import {TileOption} from '../types/sharedTypes';
import Ladder from './Ladder';

export default class Cell extends Phaser.Physics.Arcade.Sprite {
  tileOption: TileOption;

  effectSprites: Phaser.GameObjects.Sprite[] = [];

  exit: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, image: TileOption) {
    super(scene, x * CELL_WIDTH, y * CELL_WIDTH, 'batch1', image);
    this.tileOption = image;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  get isPassable(): boolean {
    return this.tileOption === TileOption.Grass || this.exit;
  }

  get isExit(): boolean {
    return this.exit;
  }

  makeExit(): void {
    this.effectSprites.push(new Ladder(this.scene, this.x / CELL_WIDTH, this.y / CELL_WIDTH));
    this.exit = true;
  }
}
