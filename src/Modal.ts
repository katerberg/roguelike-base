import {Display} from 'rot-js';
import {symbols} from '../types/constants';

export class Modal implements EventListenerObject {
  display: Display;

  height: number;

  width: number;

  positionX: number;

  positionY: number;

  callback: (result: string) => void;

  modalChoices: {[keyPress: string]: string} | undefined;

  constructor(
    display: Display,
    callback: (result: string) => void,
    text: string,
    width: number,
    positionX: number,
    positionY: number,
    modalChoices?: {[keyPress: string]: string},
  ) {
    this.display = display;
    this.callback = callback;
    this.width = width;
    this.height = this.addText(text) + 2;
    this.positionX = positionX;
    this.positionY = positionY;
    this.addOutline();
    this.clear();
    this.addText(text);
    this.modalChoices = modalChoices;
    window.addEventListener('keydown', this);
  }

  handleEvent(evt: KeyboardEvent): void {
    const {key} = evt;
    if (this.modalChoices && !(key in this.modalChoices)) {
      return;
    }
    const choices = this.modalChoices || {};
    window.removeEventListener('keydown', this as EventListenerObject);
    this.callback(choices[key]);
  }

  addOutline(): void {
    for (let x = this.positionX + 1; x < this.positionX + this.width; x++) {
      this.display.draw(x, this.positionY, symbols.MODAL_X, null, null);
      this.display.draw(x, this.positionY + this.height, symbols.MODAL_X, null, null);
    }
    for (let y = this.positionY + 1; y < this.positionY + this.height; y++) {
      this.display.draw(this.positionX, y, symbols.MODAL_Y, null, null);
      this.display.draw(this.positionX + this.width, y, symbols.MODAL_Y, null, null);
    }
    this.display.draw(this.positionX, this.positionY, symbols.MODAL_CORNER_TOP_LEFT, null, null);
    this.display.draw(this.positionX, this.positionY + this.height, symbols.MODAL_CORNER_BOTTOM_LEFT, null, null);
    this.display.draw(this.positionX + this.width, this.positionY, symbols.MODAL_CORNER_TOP_RIGHT, null, null);
    this.display.draw(
      this.positionX + this.width,
      this.positionY + this.height,
      symbols.MODAL_CORNER_BOTTOM_RIGHT,
      null,
      null,
    );
  }

  addText(text: string): number {
    return this.display.drawText(this.positionX + 1, this.positionY + 1, text, this.width - 2);
  }

  clear(): void {
    for (let x = this.positionX + 1; x < this.positionX + this.width; x++) {
      for (let y = this.positionY + 1; y < this.positionY + this.height; y++) {
        this.display.draw(x, y, ' ', null, null);
      }
    }
  }
}
