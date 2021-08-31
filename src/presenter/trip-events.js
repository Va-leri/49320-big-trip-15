import TripEventsView from '../view/trip-events.js';
import TripItemsListView from '../view/trip-items-list.js';
import TripSortView from '../view/trip-sort.js';
import NoPointsView from '../view/no-points.js';
import { RenderPosition, SortType } from '../const.js';
import { render } from '../utils/render.js';
import PointPresenter from './point.js';
import { updateItem } from '../utils/common.js';
import dayjs from 'dayjs';

const defaultSortType = SortType.DAY;

export default class TripEvents {
  constructor(tripEventsContainer, tripItemsModel) {
    this._tripItemsModel = tripItemsModel;
    this._tripEventsContainer = tripEventsContainer;
    this._tripEvents = new TripEventsView();
    this._tripItemsList = new TripItemsListView();
    this._tripSort = new TripSortView();
    this._noPoints = new NoPointsView();
    this._pointPresenter = new Map();
    this._currentSortType = defaultSortType;

    this._handleTripItemChange = this._handleTripItemChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleTripSort = this._handleTripSort.bind(this);

    this._sortFunctionByType = new Map();
  }

  init() {
    this._sortFunctionByType.set(SortType.DAY, this._sortByDay);
    this._sortFunctionByType.set(SortType.PRICE, this._sortByPrice);
    this._sortFunctionByType.set(SortType.TIME, this._sortByTime);
    render(this._tripEventsContainer, this._tripEvents, RenderPosition.BEFOREEND);

    this._renderTripEvents();
  }

  _getTripItems() {
    const sortFunction = this._sortFunctionByType.get(this._currentSortType);
    return this._tripItemsModel.tripItems.slice().sort(sortFunction);
  }

  _sortByDay(itemA, itemB) {
    return dayjs(itemA.dateFrom).diff(dayjs(itemB.dateFrom));
  }

  _sortByPrice(itemA, itemB) {
    return itemB.basePrice - itemA.basePrice;
  }

  _sortByTime(itemA, itemB) {
    return dayjs(itemA.dateFrom).diff(dayjs(itemA.dateTo)) - dayjs(itemB.dateFrom).diff(dayjs(itemB.dateTo));
  }

  _fillTripItemsList() {
    this._getTripItems().forEach((item) => {
      this._renderTripItem(item);
    });
  }

  _renderTripItem(item) {
    const pointPresenter = new PointPresenter(this._tripItemsList, this._handleTripItemChange, this._handleModeChange);
    pointPresenter.init(item);
    this._pointPresenter.set(item.id, pointPresenter);
  }

  _renderNoPoints() {
    render(this._tripEvents, this._noPoints, RenderPosition.BEFOREEND);
  }

  _renderTripSort() {
    render(this._tripEvents, this._tripSort, RenderPosition.BEFOREEND);
    this._tripSort.setSortTypeChangeHandler(this._handleTripSort);
  }

  _clearTripItemsList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handleTripSort(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTripItemsList();
    this._fillTripItemsList();
  }

  _renderPointsList() {
    render(this._tripEvents, this._tripItemsList, RenderPosition.BEFOREEND);
    this._fillTripItemsList();
  }

  _renderTripEvents() {
    if (this._getTripItems().every((item) => !item)) {
      this._renderNoPoints();
    } else {
      this._renderTripSort();
      this._renderPointsList();
    }
  }

  _handleTripItemChange(newItem) {
    this._items = updateItem(this._items, newItem);
    this._pointPresenter.get(newItem.id).init(newItem);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((point) => point._resetMode());
  }
}
