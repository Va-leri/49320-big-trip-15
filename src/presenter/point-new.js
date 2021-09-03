import TripItemEditionView from '../view/trip-item-edition.js';
import { destinations } from '../mock/trip-item-mock.js';
import { TYPES, KeyCode, RenderPosition, UpdateType, UserAction } from '../const.js';
import { render, remove } from '../utils/render.js';
import { nanoid } from 'nanoid';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};


export default class PointNew {
  constructor(itemsList, changeHandler, changeMode, offersModel) {
    this._offersModel = offersModel;
    this._itemsList = itemsList;
    this._tripItemEditionComponent = null;
    this._mode = Mode.DEFAULT;
    this._handleTripItemChange = changeHandler;
    this._changeMode = changeMode;

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
      Object.assign({ id: nanoid() }, newItem),
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
  }

  init() {
    if (this._tripItemEditionComponent !== null) {
      return;
    }

    this._tripItemEditionComponent = new TripItemEditionView(undefined, this._offersModel.offers, destinations, TYPES);

    this._tripItemEditionComponent.setDeleteBtnClickHandler(this._handleDeleteBtnClick);
    this._tripItemEditionComponent.setFormSubmitHadler(this._formSubmitHadler);

    render(this._itemsList, this._tripItemEditionComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeydownHandler);

    // const prevItemEditionComponent = this._tripItemEditionComponent;
    // this._tripItemEditionComponent.setRollupBtnClickHandler(this._tripItemFormRollupBtnClickHandler);

    /* if (!prevItemComponent || !prevItemEditionComponent) {
      render(this._itemsList, this._tripItemComponent, RenderPosition.BEFOREEND);
      return;
    } */

    /* if (this._mode === Mode.DEFAULT) {
      replace(this._tripItemComponent, prevItemComponent);
      return;
    } */

    // if (this._mode === Mode.EDITING) {
    // replace(this._tripItemEditionComponent, prevItemEditionComponent);
    // }
  }
}
