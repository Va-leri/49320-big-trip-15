import dayjs from 'dayjs';

const createTripRouteTemplate = (tripPointsArr) =>
  tripPointsArr.length > 3 ?
    `${tripPointsArr[0].destination.name} &mdash;...&mdash; ${tripPointsArr[tripPointsArr.length - 1].destination.name}` :
    `${tripPointsArr.map(({ destination }) => destination.name).join(' &mdash; ')}`;

const createTripDatesTemplate = (tripPointsArr) =>
  `${dayjs(tripPointsArr[0].dates.from).format('MMM DD')} &mdash; ${dayjs(tripPointsArr[tripPointsArr.length - 1].dates.to).format('MMM DD')}`;

export const tripInfo = (tripPoints) => {
  const tripRouteTemplate = createTripRouteTemplate(tripPoints);

  const tripDatesTemplate = createTripDatesTemplate(tripPoints);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripRouteTemplate}</h1>

      <p class="trip-info__dates">${tripDatesTemplate}</p>
    </div>
  </section>`;
};
