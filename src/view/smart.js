import AbstractView from './abstract';
import { replace } from '../utils/render';

export default class Smart extends AbstractView {
  restoreHandlers() {
    throw new Error(`Abstract method not implemented: ${this.getTemplate.name}`);
  }

  updateElement() {
    const prevElement = this.getElement();
    this.removeElement(prevElement);
    const newElement = this.getElement();
    replace(newElement, prevElement);
  }

  updateState(newStateValue, needRedraw = true) {
    if (!newStateValue) {
      return;
    }
    this._state = Object.assign({}, this._state, newStateValue);
    if (!needRedraw) {
      return;
    }
    this.updateElement();
  }
}
