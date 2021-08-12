import { createElement } from '../utils';

const createTripItemsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripItemsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripItemsListTemplate();
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
