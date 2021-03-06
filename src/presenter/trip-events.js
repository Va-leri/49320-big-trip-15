import TripEventsView from '../view/trip-events.js';
import TripItemsListView from '../view/trip-items-list.js';
import TripSortView from '../view/trip-sort.js';
import NoPointsView from '../view/no-points.js';
import { RenderPosition, SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { render, remove } from '../utils/render.js';
import PointPresenter, { State as PointPresenterViewState } from './point.js';
import PointNewPresenter from './point-new.js';
import dayjs from 'dayjs';
import { filterItems } from '../utils/filter.js';
import LoadingView from '../view/loading.js';

const defaultSortType = SortType.DAY;

export default class TripEvents {
  constructor(tripEventsContainer, tripItemsModel, filterModel, api) {
    this._tripItemsModel = tripItemsModel;
    this._filterModel = filterModel;
    this._tripEventsContainer = tripEventsContainer;
    this._tripSort = null;
    this._noPoints = null;
    this._currentSortType = defaultSortType;
    this._isLoading = true;
    this._api = api;

    this._tripEvents = new TripEventsView();
    this._tripItemsList = new TripItemsListView();
    this._pointPresenter = new Map();
    this._loadingComponent = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleTripSort = this._handleTripSort.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._sortFunctionByType = new Map();
    this._sortFunctionByType.set(SortType.DAY, this._sortByDay);
    this._sortFunctionByType.set(SortType.PRICE, this._sortByPrice);
    this._sortFunctionByType.set(SortType.TIME, this._sortByTime);

    this._pointNewPresenter = new PointNewPresenter(this._tripItemsList, this._handleViewAction, this._handleModeChange);
  }

  init() {
    this._tripItemsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    render(this._tripEventsContainer, this._tripEvents, RenderPosition.BEFOREEND);
    this._renderTripEvents();
  }

  destroy() {
    this._clearTripEvents();
    this._resetSortType();
    remove(this._tripEvents);

    this._tripItemsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTripItem(callback) {
    this._currentSortType = defaultSortType;
    this._filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERITHING);
    this._pointNewPresenter.init(callback);
  }

  _getTripItems() {
    this._activeFilter = this._filterModel.activeFilter;
    const tripItems = this._tripItemsModel.tripItems;
    const filteredTripItems = filterItems[this._activeFilter](tripItems);

    const sortFunction = this._sortFunctionByType.get(this._currentSortType);
    return filteredTripItems.slice().sort(sortFunction);
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
    this._getTripItems().slice().forEach((item) => {
      this._renderTripItem(item);
    });
  }

  _renderTripItem(item) {
    const pointPresenter = new PointPresenter(this._tripItemsList, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(item);
    this._pointPresenter.set(item.id, pointPresenter);
  }

  _renderNoPoints() {
    this._noPoints = new NoPointsView(this._activeFilter);
    render(this._tripEvents, this._noPoints, RenderPosition.BEFOREEND);
  }

  _renderTripSort() {
    this._tripSort = new TripSortView();
    render(this._tripEvents, this._tripSort, RenderPosition.BEFOREEND);
    this._tripSort.setSortTypeChangeHandler(this._handleTripSort);
  }

  _clearTripItemsList() {
    this._pointNewPresenter.destroy();
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

  _renderLoading() {
    render(this._tripEvents, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderPointsList() {
    render(this._tripEvents, this._tripItemsList, RenderPosition.BEFOREEND);
    this._fillTripItemsList();
  }

  _renderTripEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getTripItems().every((item) => !item)) {
      this._renderNoPoints();
    } else {
      this._renderTripSort();
      this._renderPointsList();
    }
  }

  _clearTripEvents() {
    this._clearTripItemsList();

    remove(this._noPoints);
    remove(this._tripSort);
    remove(this._tripItemsList);
  }

  _resetSortType() {
    this._currentSortType = defaultSortType;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((point) => point._resetMode());
  }

  _handleViewAction(actionType, updateType, data) {
    switch (actionType) {
      case UserAction.UPDATE_TRIP_POINT:
        this._pointPresenter.get(data.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(data)
          .then((response) => {
            this._tripItemsModel.updateItem(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(data.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_TRIP_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addNewPoint(data)
          .then((response) => {
            this._tripItemsModel.addItem(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_TRIP_POINT:
        this._pointPresenter.get(data.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(data)
          .then(() => {
            this._tripItemsModel.deleteItem(updateType, data);
          })
          .catch(() => {
            this._pointPresenter.get(data.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this._clearTripEvents();
        this._renderTripEvents();
        break;

      case UpdateType.MAJOR:
        this._clearTripEvents();
        this._resetSortType();
        this._renderTripEvents();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);

        this._renderTripEvents();
        break;
    }
  }
}
