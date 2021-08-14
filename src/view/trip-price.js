import AbstractView from './abstract';

const createTripPriceTemplate = (tripPoints) => {
  const totalPrice = tripPoints.reduce((price, { basePrice }) => price + basePrice, 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`;
};

export default class TripPrice extends AbstractView {
  constructor(tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripPriceTemplate(this._tripPoints);
  }
}
