import { humanizeDate } from '../utils/common.js';
import { BLANC_POINT } from '../const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createTripTypesTemplate = (tripTypes) => tripTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
  </div>`).join('');

const createDestinationsListTemplate = (destinations) => destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');

const createOffersTemplate = (areAvailableOffers, offersByType, tripType, activeOffers, isDisabled) => {
  if (!areAvailableOffers) {
    return '';
  }
  const availabelOffers = offersByType.find((item) => item.type === tripType).offers;
  const offersList = availabelOffers.map(({ title, price }) => {
    const isActive = activeOffers.length ?
      Boolean(activeOffers.find((item) => item.title === title))
      : false;
    return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.replaceAll(' ', '-')}-1" type="checkbox" name="event-offer-${title.replaceAll(' ', '-')}" ${isActive ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <label class="event__offer-label" for="event-offer-${title.replaceAll(' ', '-')}-1">
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

const createDestinationDescriptionTemplate = (isDestination, destination) => {
  if (!isDestination) {
    return '';
  }
  const { description, pictures } = destination;
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>
  </section>`;
};

const createTripItemEditionTemplate = (state, offersByType, destinations, tripTypes, isNew) => {
  const { type, dateFrom, dateTo, id, basePrice, destination, offers, isDestination, areAvailableOffers, isDisabled, isSaving, isDeleting } = state;

  const offersTemplate = createOffersTemplate(areAvailableOffers, offersByType, type, offers, isDisabled);

  const destinationsTemplate = createDestinationsListTemplate(destinations);
  const tripTypesTemplate = createTripTypesTemplate(tripTypes);
  const destinationDescriptionTemplate = createDestinationDescriptionTemplate(isDestination, destination);


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isDestination ? destination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} required>
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>

        ${isNew ? '<button class="event__reset-btn" type="reset">Cancel</button>' : `<button class="event__reset-btn" type="reset" ${isDisabled && !isNew ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>`}


        ${!isNew ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden"> Open event</span>
        </button>` : ''}

      </header>
      <section class="event__details">

        ${offersTemplate}

        ${destinationDescriptionTemplate}
      </section>
    </form>
  </li>`;
};

export default class TripItemEdition extends SmartView {
  constructor(tripItemData, offersByType, destinations, tripTypes, isNew = false) {
    super();
    this._state = TripItemEdition.parseDataToState(tripItemData || BLANC_POINT, offersByType);
    this._offersByType = offersByType;
    this._tripTypes = tripTypes;
    this._destinations = destinations;
    this._isNew = isNew;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._tripTypeClickHandler = this._tripTypeClickHandler.bind(this);
    this._offerCheckboxChangeHandler = this._offerCheckboxChangeHandler.bind(this);
    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._deleteBtnClickHandler = this._deleteBtnClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  resetState(data) {
    data = data ? data : BLANC_POINT;
    this.updateState(TripItemEdition.parseDataToState(data, this._offersByType));
  }

  _setInnerHandlers() {
    this._destinationInput = this.getElement().querySelector('.event__input--destination');
    this._destinationInput.addEventListener('change', this._destinationChangeHandler);

    this.getElement().querySelector('.event__type-list').addEventListener('click', this._tripTypeClickHandler);
    this.getElement().querySelectorAll('.event__offer-checkbox').forEach((input) => input.addEventListener('change', this._offerCheckboxChangeHandler));
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputChangeHandler);
    this._submitBtn = this.getElement().querySelector('.event__save-btn');
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();

    this.setFormSubmitHadler(this._callback.formSubmit);
    this.setDeleteBtnClickHandler(this._callback.deleteBtnClick);

    if (this._isNew) {
      return;
    }
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
  }

  _destinationChangeHandler(evt) {
    if (this._submitBtn.disabled) {
      this._submitBtn.disabled = false;
      this._destinationInput.setCustomValidity('');
    }

    if (!evt.target.value) {
      this._submitBtn.disabled = true;
      this._destinationInput.setCustomValidity('Choose the correct destination from the list');
      this._destinationInput.reportValidity();
      return;
    }
    const destination = this._destinations.find((item) => item.name === evt.target.value);

    if (!destination) {
      this._submitBtn.disabled = true;
      this._destinationInput.setCustomValidity('Choose the correct destination from the list');
      this._destinationInput.reportValidity();
      return;
    }

    const newValue = {
      destination,
      isDestination: true,
    };

    this.updateState(newValue);
  }

  _dateChangeHandler([date], dateStr, datepicker) {
    this.updateState({ [datepicker.config.dateType]: date }, false);
    if (datepicker === this._datepickerStart) {
      this._datepickerEnd.set('minDate', date);
    } else if (datepicker === this._datepickerEnd) {
      this._datepickerStart.set('maxDate', date);
    }
  }

  _setDatepicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    const dateInput = {
      start: this.getElement().querySelector(`#event-start-time-${this._state.id}`),
      end: this.getElement().querySelector(`#event-end-time-${this._state.id}`),
    };
    this._datepickerStart = flatpickr(dateInput.start, {
      defaultDate: this._state.dateFrom,
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      maxDate: this._state.dateTo,
      onChange: this._dateChangeHandler,
      dateType: 'dateFrom',
    });

    this._datepickerEnd = flatpickr(dateInput.end, {
      defaultDate: this._state.dateTo,
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      minDate: this._state.dateFrom,
      onChange: this._dateChangeHandler,
      dateType: 'dateTo',
    });

  }

  _tripTypeClickHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const offersByType = this._offersByType;

    const newValue = {
      type: evt.target.value,
      offers: [],
      areAvailableOffers: Boolean(offersByType.find((item) => item.type === evt.target.value).offers.length),
    };

    this.updateState(newValue);
  }

  _offerCheckboxChangeHandler(evt) {
    const input = evt.target;
    const offerTitle = input.parentNode.querySelector('.event__offer-title').innerText;
    let activeOffers;
    if (input.checked) {
      activeOffers = this._state.offers.slice();
      const availabelOffers = this._offersByType.find((offers) => offers.type === this._state.type).offers;
      const newOffer = availabelOffers.find((offer) => offer.title === offerTitle);
      activeOffers.push(newOffer);
    } else {
      activeOffers = this._state.offers.filter((offer) => offer.title !== offerTitle);
    }
    this.updateState({ offers: activeOffers }, false);
  }

  _priceInputChangeHandler(evt) {
    this.updateState({ basePrice: parseInt(evt.target.value, 10) }, false);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripItemEdition.parseStateToData(this._state));
  }

  setFormSubmitHadler(callback) {
    const tripItemEditionForm = this.getElement().querySelector('form');
    tripItemEditionForm.addEventListener('submit', this._formSubmitHandler);
    this._callback.formSubmit = callback;
  }

  _rollupBtnClickHandler() {
    this._callback.rollupBtnClick();
  }

  setRollupBtnClickHandler(callback) {
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
    this._callback.rollupBtnClick = callback;
  }

  _deleteBtnClickHandler() {
    this._callback.deleteBtnClick(TripItemEdition.parseStateToData(this._state));
  }

  setDeleteBtnClickHandler(callback) {
    this._callback.deleteBtnClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteBtnClickHandler);
  }

  getTemplate() {
    return createTripItemEditionTemplate(this._state, this._offersByType, this._destinations, this._tripTypes, this._isNew);
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerEnd.destroy();

      this._datepickerStart = null;
      this._datepickerEnd = null;
    }
  }

  static parseDataToState(data, offersByType) {
    return Object.assign({}, data, {
      basePrice: data.basePrice ? data.basePrice : '',
      isDestination: data.destination !== undefined,
      areAvailableOffers: Boolean(offersByType.find((item) => item.type === data.type).offers.length),
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseStateToData(state) {
    const newData = Object.assign({}, state);

    if (!state.isDestination) {
      newData.destination = undefined;
    }

    if (!state.areAvailableOffers) {
      newData.offers = [];
    }

    if (!state.basePrice) {
      newData.basePrice = 0;
    }

    delete newData.isDestination;
    delete newData.areAvailableOffers;
    delete newData.isDisabled;
    delete newData.isSaving;
    delete newData.isDeleting;
    return newData;
  }
}
