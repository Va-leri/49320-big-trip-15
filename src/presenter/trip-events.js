import TripEventsView from '../view/trip-events.js';
import TripItemsListView from '../view/trip-items-list.js';
import TripSortView from '../view/trip-sort.js';
import NoPointsView from '../view/no-points.js';
import { RenderPosition } from '../const.js';
import { render } from '../utils/render.js';
import PointPresenter from './point.js';
import { updateItem } from '../utils/common.js';

export default class TripEvents {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripEvents = new TripEventsView();
    this._tripItemsList = new TripItemsListView();
    this._tripSort = new TripSortView();
    this._noPoints = new NoPointsView();
    this._poinPresenter = new Map();

    this._handleTripItemChange = this._handleTripItemChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(items) {
    this._items = items;
    render(this._tripEventsContainer, this._tripEvents, RenderPosition.BEFOREEND);

    this._renderTripEvents(this._items);
  }

  _fillTripItemsList() {
    this._items.forEach((item) => {
      this._renderTripItem(item);
    });
  }

  _renderTripItem(item) {
    const pointPresenter = new PointPresenter(this._tripItemsList, this._handleTripItemChange, this._handleModeChange);
    pointPresenter.init(item);
    this._poinPresenter.set(item.id, pointPresenter);
  }

  _renderNoPoints() {
    render(this._tripEvents, this._noPoints, RenderPosition.BEFOREEND);
  }

  _renderTripSort() {
    render(this._tripEvents, this._tripSort, RenderPosition.BEFOREEND);
  }

  _renderPointsList() {
    render(this._tripEvents, this._tripItemsList, RenderPosition.BEFOREEND);
    this._fillTripItemsList();
  }

  _renderTripEvents() {
    if (this._items.every((item) => !item)) {
      this._renderNoPoints();
    } else {
      this._renderTripSort();
      this._renderPointsList();
    }
  }

  _handleTripItemChange(newItem) {
    this._items = updateItem(this._items, newItem);
    this._poinPresenter.get(newItem.id).init(newItem);
  }

  _handleModeChange() {
    this._poinPresenter.forEach((point) => point._resetMode());
  }
}
