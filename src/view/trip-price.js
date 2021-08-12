import { createElement } from '../utils';

const createTripPriceTemplate = (tripPoints) => {
  const totalPrice = tripPoints.reduce((price, { basePrice }) => price + basePrice, 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`;
};

export default class TripPrice {
  constructor(tripPoints) {
    this._element = null;
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripPriceTemplate(this._tripPoints);
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
