import PhaserLogo from '../objects/phaserLogo';
import FpsText from '../objects/fpsText';
import {DungeonMap} from '../types/sharedTypes';
import {MapLevel} from '../logicalObjects/MapLevel';

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText | undefined;
  devmode: boolean;
  dungeonMap: DungeonMap;

  constructor() {
    super({key: 'MainScene'});
  }

  create(): void {
    this.devmode = window.location.href.indexOf('devmode') > -1;
    if (this.devmode) {
      this.fpsText = new FpsText(this);
      this.add
        .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
          color: '#000000',
          fontSize: '24px',
        })
        .setOrigin(1, 0);
      this.renderAllSprites();
      new PhaserLogo(this, this.cameras.main.width / 2, 0);
    }
    this.dungeonMap = {
      currentLevel: 1,
      levels: {},
    };
    this.dungeonMap.levels[1] = this.createMap(1);
  }

  private createMap(levelNumber: number): MapLevel {
    return new MapLevel({levelNumber, game: this});
  }

  private renderAllSprites(): void {
    for (let j = 0; j < 18; j++) {
      for (let i = 0; i < 25; i++) {
        this.add.image(16 + i * 32, 16 + j * 32, 'batch1', i + j * 25);
        this.add.text(16 + i * 32, 16 + j * 32, `${i + j * 25}`, {fontSize: '10px', color: '#000000'});
      }
    }
  }

  update(): void {
    this.fpsText?.update();
  }
}
