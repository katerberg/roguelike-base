import 'regenerator-runtime/runtime';
import {Display, Scheduler} from 'rot-js';

import SchedulerType from 'rot-js/lib/scheduler/scheduler';
import Simple from 'rot-js/lib/scheduler/simple';
import {dimensions} from '../types/constants';

export class Game {
  display: Display;

  devMode: boolean;

  level!: number;

  scheduler!: SchedulerType<Simple>;

  constructor() {
    this.display = new Display({width: dimensions.WIDTH, height: dimensions.HEIGHT});
    this.devMode = window.location.href.indexOf('devmode') > -1;
    this.resetAll();
    const container = this.display.getContainer();
    if (container) {
      document.body.appendChild(container);
    }
  }

  resetAll(): void {
    this.level = 0;
    this.scheduler = new Scheduler.Simple();
    this.init();
  }

  async nextTurn(): Promise<boolean> {
    const actor = this.scheduler.next();
    if (!actor) {
      return false;
    }
    await actor.act();
    return true;
  }

  async init(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (1) {
      // eslint-disable-next-line no-await-in-loop
      const good = await this.nextTurn();
      if (!good) {
        break;
      }
    }
  }
}
