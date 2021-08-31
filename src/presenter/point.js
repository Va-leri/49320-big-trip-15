import TripItemView from '../view/trip-item.js';
import TripItemEditionView from '../view/trip-item-edition.js';
import { offersByType, destinations } from '../mock/trip-item-mock.js';
import { TYPES, KeyCode, RenderPosition } from '../const.js';
import { render, replace, remove } from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
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
    this._formSubmitHadler = this._formSubmitHadler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
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

  _formSubmitHadler(data) {
    this._handleTripItemChange(data);
    this._replaceFormToItem();
  }

  _handleFavoriteClick() {
    const newItem = Object.assign({}, this._item, { 'isFavorite': !this._item.isFavorite });
    this._handleTripItemChange(newItem);
  }

  destroy() {
    remove(this._tripItemComponent);
    remove(this._tripItemEditionComponent);
  }

  init(item) {
    this._item = item;

    const prevItemComponent = this._tripItemComponent;
    const prevItemEditionComponent = this._tripItemEditionComponent;

    this._tripItemComponent = new TripItemView(this._item);
    this._tripItemEditionComponent = new TripItemEditionView(this._item, offersByType, destinations, TYPES);

    this._tripItemComponent.setRollupBtnClickHandler(this._tripItemRollupBtnClickHandler);
    this._tripItemComponent.setFavoriteClikHandler(this._handleFavoriteClick);

    this._tripItemEditionComponent.setFormSubmitHadler(this._formSubmitHadler);

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
      replace(this._tripItemEditionComponent, prevItemEditionComponent);
    }
  }
}
