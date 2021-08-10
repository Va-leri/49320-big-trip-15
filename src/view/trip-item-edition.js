import { humanizeDate } from '../utils';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createTripTypesTemplate = (tripTypes) => tripTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
  </div>`).join('');

const createDestinationsTemplate = (destinationsArr) => destinationsArr.map((destination) => `<option value="${destination}"></option>`).join('');

const createOffersTemplate = (availabelOffers, activeOffers) => {
  const offersList = availabelOffers.map(({ title, price }) => {
    const isActive = activeOffers ?
      Boolean(activeOffers.find((item) => item.title === title))
      : false;
    return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isActive ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${title}-1">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
  })
    .join('');
  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
  ${offersList}
  </div>
  </section>`;
};

const crateDestinationDescriptionTemplate = ({ description, pictures }) => (`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>
  </section>`);

export const tripItemEdition = ({ type, dateFrom, dateTo, basePrice, destination, offers }, offersByType, TYPES, CITIES) => {

  const availabelOffers = offersByType.find((item) => item.type === type).offers;
  const offersTemplate = createOffersTemplate(availabelOffers, offers);

  const tripTypesTemplate = createTripTypesTemplate(TYPES);
  const destinationsTemplate = createDestinationsTemplate(CITIES);
  const destinationDescriptionTemplate = destination ? crateDestinationDescriptionTemplate(destination) : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${tripTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${destination ? basePrice : ''}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">

        ${offersTemplate}

        ${destinationDescriptionTemplate}
      </section>
    </form>
  </li>`;
};
