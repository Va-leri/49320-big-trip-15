import { createElement } from '../utils';

const createTripEventsTemplate = () => (
  `<section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
  </section>`
);

export default class TripEvents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsTemplate();
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


