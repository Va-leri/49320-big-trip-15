import { humanizeDate } from '../utils/common.js';
import { getPointDuration } from '../utils/trip.js';
import AbstractView from './abstract.js';

const createOffersTemplate = (offers) =>
  !offers.length ? '' :
    `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
    ${offers.map(({ title, price }) =>
    (`<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`)).join('')}
    </ul>`;

const createTripItemTemplate = ({ type, dateFrom, dateTo, basePrice, destination, offers, isFavorite }) => {
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createOffersTemplate(offers);

  const pointDuration = getPointDuration(dateFrom, dateTo);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${humanizeDate(dateFrom, 'MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${humanizeDate(dateFrom, 'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${humanizeDate(dateTo, 'HH:mm')}</time>
        </p>
        <p class="event__duration">${pointDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice || ''}</span>
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

export default class TripItem extends AbstractView {
  constructor(tripPoint) {
    super();
    this._data = tripPoint;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripItemTemplate(this._data);
  }

  _rollupBtnClickHandler() {
    this._callback.rollupBtnClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteBtnClick();
  }

  setRollupBtnClickHandler(callback) {
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
    this._callback.rollupBtnClick = callback;
  }

  setFavoriteClickHandler(callback) {
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
    this._callback.favoriteBtnClick = callback;
  }

}
