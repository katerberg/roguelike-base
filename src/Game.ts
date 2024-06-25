import 'regenerator-runtime/runtime';
import {Display} from 'rot-js';

import {dimensions} from '../types/constants';

export class Game {
  display: Display;

  constructor() {
    this.display = new Display({width: dimensions.WIDTH, height: dimensions.HEIGHT});
    const container = this.display.getContainer();
    if (container) {
      document.body.appendChild(container);
    }
  }
}
