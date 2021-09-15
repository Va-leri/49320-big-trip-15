import AbstractView from './abstract';
import { MenuItem } from '../const';

const createViewMenuTemplate = (viewMode) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn ${viewMode === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}" href="#" data-value="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn ${viewMode === MenuItem.STATISTICS ? 'trip-tabs__btn--active' : ''}" href="#" data-value="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

const defaultViewMode = MenuItem.TABLE;

export default class ViewMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._activeViewMode = defaultViewMode;
    this._activeViewItem = this.getElement().querySelector(`[data-value="${this._activeViewMode}"`);
  }

  getTemplate() {
    return createViewMenuTemplate(this._activeViewMode);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.menuClick(evt.target.dataset.value);
  }

  setMenuClickHandler(callback) {
    this.getElement().addEventListener('click', this._menuClickHandler);
    this._callback.menuClick = callback;
  }

  setActiveView(viewMode) {
    if (this._activeViewItem) {
      this._activeViewItem.classList.remove('trip-tabs__btn--active');
    }
    this._activeViewMode = viewMode;
    const activeViewItem = this.getElement().querySelector(`[data-value="${this._activeViewMode}"`);
    if (activeViewItem) {
      this._activeViewItem = activeViewItem;
      this._activeViewItem.classList.add('trip-tabs__btn--active');
    } else {
      this._activeViewItem = null;
    }
  }
}
