import TripItemEditionView from '../view/trip-item-edition.js';
import { destinations, offersByType } from '../main.js';
import { TYPES, KeyCode, RenderPosition, UpdateType, UserAction } from '../const.js';
import { render, remove } from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};


export default class PointNew {
  constructor(itemsList, changeHandler, changeMode) {
    this._itemsList = itemsList;
    this._tripItemEditionComponent = null;
    this._mode = Mode.DEFAULT;
    this._handleTripItemChange = changeHandler;
    this._changeMode = changeMode;
    this._destroyCallback = null;

    this._formSubmitHadler = this._formSubmitHadler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleDeleteBtnClick = this._handleDeleteBtnClick.bind(this);
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _formSubmitHadler(newItem) {
    this._handleTripItemChange(
      UserAction.ADD_TRIP_POINT,
      UpdateType.MAJOR,
      newItem,
    );
    this.destroy();
  }

  _handleDeleteBtnClick() {
    this.destroy();
  }

  destroy() {
    if (this._tripItemEditionComponent === null) {
      return;
    }

    remove(this._tripItemEditionComponent);
    this._tripItemEditionComponent = null;
    document.removeEventListener('keydown', this._escKeydownHandler);

    if (this._destroyCallback) {
      this._destroyCallback();
    }
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripItemEditionComponent !== null) {
      return;
    }

    this._tripItemEditionComponent = new TripItemEditionView(undefined, offersByType, destinations, TYPES, true);

    this._tripItemEditionComponent.setDeleteBtnClickHandler(this._handleDeleteBtnClick);
    this._tripItemEditionComponent.setFormSubmitHadler(this._formSubmitHadler);

    render(this._itemsList, this._tripItemEditionComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeydownHandler);
  }
}
