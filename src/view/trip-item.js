import dayjs from 'dayjs';

const createOffersTemplate = (offers) =>
  !offers ? '' :
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
    ${offers.map(({ title, price }) =>
    (`<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`)).join('')}
    </ul>`;

const getPointDuration = ({ from, to }) => {
  const durationInDays = dayjs(to).diff(dayjs(from), 'd');
  const durationInHours = dayjs(to).diff(dayjs(from), 'h');
  const durationInMinutes = dayjs(to).diff(dayjs(from), 'm');

  const duration = {
    D: durationInDays,
    get H() {
      return durationInHours - this.D * 24;
    },
    get M() {
      return durationInMinutes - this.D * 24 * 60 - this.H * 60;
    },
  };

  const formatedDuration = Object.entries(duration).map(([units, value]) => {
    if (value) {
      if (value < 10) {
        value = `0${value}`;
      }
      return `${value}${units} `;
    }
  }).join('');

  return formatedDuration;
};


export const tripItem = ({ type, dates, basePrice, destination, offers, isFavorite }) => {
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createOffersTemplate(offers);

  const pointDuration = getPointDuration(dates);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dayjs(dates.to).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dates.from}">${dayjs(dates.from).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dates.to}">${dayjs(dates.to).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${pointDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${offersTemplate}
      <button class="event__favorite-btn ${favoriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
