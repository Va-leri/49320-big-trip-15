import TripItemView from '../view/trip-item.js';
import TripItemEditionView from '../view/trip-item-edition.js';
import { destinations, offersByType } from '../main.js';
import { TYPES, KeyCode, RenderPosition, UpdateType, UserAction } from '../const.js';
import { render, replace, remove } from '../utils/render.js';
import { areDatesEqual } from '../utils/trip-item.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};


export default class Point {
  constructor(itemsList, changeHandler, changeMode) {
    this._itemsList = itemsList;
    this._tripItemComponent = null;
    this._tripItemEditionComponent = null;
    this._mode = Mode.DEFAULT;
    this._handleTripItemChange = changeHandler;
    this._changeMode = changeMode;

    this._tripItemFormRollupBtnClickHandler = this._tripItemFormRollupBtnClickHandler.bind(this);
    this._tripItemRollupBtnClickHandler = this._tripItemRollupBtnClickHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteBtnClick = this._handleDeleteBtnClick.bind(this);
  }

  _resetMode() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToItem();
    }
  }

  _replaceFormToItem() {
    replace(this._tripItemComponent, this._tripItemEditionComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this._escKeydownHandler);
  }

  _replaceItemToForm() {
    replace(this._tripItemEditionComponent, this._tripItemComponent);
    document.addEventListener('keydown', this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      evt.preventDefault();
      this._tripItemEditionComponent.resetState(this._item);
      this._replaceFormToItem();
    }
  }

  _tripItemRollupBtnClickHandler() {
    this._replaceItemToForm();
  }

  _tripItemFormRollupBtnClickHandler() {
    this._tripItemEditionComponent.resetState(this._item);
    this._replaceFormToItem();
  }

  _handleFormSubmit(updatedItem) {
    if (!isOnline()) {
      toast('You can\'t save trip point offline');
      return;
    }

    const updateType = areDatesEqual(updatedItem, this._item) ? UpdateType.PATCH : UpdateType.MINOR;

    this._handleTripItemChange(
      UserAction.UPDATE_TRIP_POINT,
      updateType,
      updatedItem,
    );
  }

  _handleFavoriteClick() {
    const newItem = Object.assign({}, this._item, { 'isFavorite': !this._item.isFavorite });
    this._handleTripItemChange(
      UserAction.UPDATE_TRIP_POINT,
      UpdateType.PATCH,
      newItem,
    );
  }

  _handleDeleteBtnClick(deletedItem) {
    if (!isOnline()) {
      toast('You can\'t delete trip point offline');
      return;
    }

    this._handleTripItemChange(
      UserAction.DELETE_TRIP_POINT,
      UpdateType.MINOR,
      deletedItem,
    );
  }

  destroy() {
    remove(this._tripItemComponent);
    remove(this._tripItemEditionComponent);
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._tripItemEditionComponent.updateState({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripItemEditionComponent.updateState({
          isSaving: true,
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._tripItemEditionComponent.updateState({
          isDeleting: true,
          isDisabled: true,
        });
        break;
      case State.ABORTING:
        this._tripItemEditionComponent.shake(resetFormState);
        this._tripItemComponent.shake(resetFormState);
        break;
    }
  }

  init(item) {
    this._item = item;

    const prevItemComponent = this._tripItemComponent;
    const prevItemEditionComponent = this._tripItemEditionComponent;

    this._tripItemComponent = new TripItemView(this._item);
    this._tripItemEditionComponent = new TripItemEditionView(this._item, offersByType, destinations, TYPES);

    this._tripItemComponent.setRollupBtnClickHandler(this._tripItemRollupBtnClickHandler);
    this._tripItemComponent.setFavoriteClikHandler(this._handleFavoriteClick);

    this._tripItemEditionComponent.setDeleteBtnClickHandler(this._handleDeleteBtnClick);
    this._tripItemEditionComponent.setFormSubmitHadler(this._handleFormSubmit);

    this._tripItemEditionComponent.setRollupBtnClickHandler(this._tripItemFormRollupBtnClickHandler);

    if (!prevItemComponent || !prevItemEditionComponent) {
      render(this._itemsList, this._tripItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripItemComponent, prevItemComponent);
      return;
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripItemComponent, prevItemEditionComponent);
      this._mode = Mode.DEFAULT;
    }
  }
}
