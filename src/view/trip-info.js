import { humanizeDate } from '../utils/common.js';
import AbstractView from './abstract';

const createTripRouteTemplate = (tripPoints) =>
  tripPoints.length > 3 ?
    `${tripPoints[0].destination ? tripPoints[0].destination.name : '...'} &mdash;...&mdash; ${tripPoints[tripPoints.length - 1].destination ? tripPoints[tripPoints.length - 1].destination.name : '...'}` :
    `${tripPoints.map(({ destination }) => destination ? destination.name : '...').join(' &mdash; ')}`;

const createTripDatesTemplate = (tripPoints) =>
  `${humanizeDate(tripPoints[0].dateFrom, 'MMM DD')} &mdash; ${humanizeDate(tripPoints[tripPoints.length - 1].dateTo, 'MMM DD')}`;

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
