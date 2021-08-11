import { createElement } from '../utils';

const createViewMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn" href="#">Table</a>
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Stats</a>
  </nav>`
);

export default class viewMenu {
  costructor() {
    this._element = null;
  }

  getTemplate() {
    return createViewMenuTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
