import { humanizeDate } from '../utils/common.js';
import AbstractView from './abstract';

const createTripRouteTemplate = (tripPointsArr) =>
  tripPointsArr.length > 3 ?
    `${tripPointsArr[0].destination.name} &mdash;...&mdash; ${tripPointsArr[tripPointsArr.length - 1].destination.name}` :
    `${tripPointsArr.map(({ destination }) => destination.name).join(' &mdash; ')}`;

const createTripDatesTemplate = (tripPointsArr) =>
  `${humanizeDate(tripPointsArr[0].dateFrom, 'MMM DD')} &mdash; ${humanizeDate(tripPointsArr[tripPointsArr.length - 1].dateTo, 'MMM DD')}`;

const createTripInfoTemplate = (tripPoints) => {
  const tripRouteTemplate = createTripRouteTemplate(tripPoints);

  const tripDatesTemplate = createTripDatesTemplate(tripPoints);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripRouteTemplate}</h1>

      <p class="trip-info__dates">${tripDatesTemplate}</p>
    </div>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripPoints);
  }
}
