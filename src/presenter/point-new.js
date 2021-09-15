import TripItemEditionView from '../view/trip-item-edition.js';
import { destinations, offersByType } from '../main.js';
import { TYPES, KeyCode, RenderPosition, UpdateType, UserAction } from '../const.js';
import { render, remove } from '../utils/render.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

export default class PointNew {
  constructor(itemsList, changeHandler, changeMode) {
    this._itemsList = itemsList;
    this._tripItemEditionComponent = null;
    this._handleTripItemChange = changeHandler;
    this._changeMode = changeMode;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleDeleteBtnClick = this._handleDeleteBtnClick.bind(this);
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(newItem) {
    if (!isOnline()) {
      toast('You can\'t create new trip point offline');
      return;
    }

    this._handleTripItemChange(
      UserAction.ADD_TRIP_POINT,
      UpdateType.MAJOR,
      newItem,
    );
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

  setSaving() {
    this._tripItemEditionComponent.updateState({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborting() {

    const resetFormState = () => {
      this._tripItemEditionComponent.updateState({
        isSaving: false,
        isDisabled: false,
      });
    };

    this._tripItemEditionComponent.shake(resetFormState);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripItemEditionComponent !== null) {
      return;
    }

    this._tripItemEditionComponent = new TripItemEditionView(undefined, offersByType, destinations, TYPES, true);

    this._tripItemEditionComponent.setDeleteBtnClickHandler(this._handleDeleteBtnClick);
    this._tripItemEditionComponent.setFormSubmitHadler(this._handleFormSubmit);

    render(this._itemsList, this._tripItemEditionComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeydownHandler);
  }
}
