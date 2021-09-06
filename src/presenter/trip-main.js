import { render, remove } from '../utils/render.js';
import { RenderPosition, UpdateType } from '../const.js';
import TripMainView from '../view/trip-main.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import ViewMenuView from '../view/view-menu.js';
import FiltersView from '../view/filters.js';
import FiltersPresenter from './filters.js';


export default class TripMain {
  constructor(tripMainContainer, tripItemsModel, filterModel) {
    this._tripItemsModel = tripItemsModel;
    this._filterModel = filterModel;
    this._filtersPresenter = null;
    this._tripMainContainer = tripMainContainer;
    this._tripMain = new TripMainView;
    this._viewMenu = new ViewMenuView;
    this._filtersForm = new FiltersView;
    this._tripInfo = null;
    this._tripPrice = null;
    this._tripControlsNavigationElement = this._tripMain.getElement().querySelector('.trip-controls__navigation');
    this._tripControlsFiltersElement = this._tripMain.getElement().querySelector('.trip-controls__filters');

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._tripItemsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripMain();
    this._renderTripInfo();
  }

  _getTripItems() {
    return this._tripItemsModel.tripItems;
  }

  _getActiveFilter() {
    return this._filterModel.activeFilter;
  }

  _renderTripInfo() {
    const tripItems = this._getTripItems().slice();

    if (tripItems.length) {
      this._tripPrice = new TripPriceView(tripItems);
      this._tripInfo = new TripInfoView(tripItems);
      render(this._tripMain.getElement(), this._tripInfo, RenderPosition.AFTERBEGIN);

      render(this._tripInfo, this._tripPrice, RenderPosition.BEFOREEND);
    }
  }

  _renderFilter() {
    const filtersPresenter = new FiltersPresenter(this._tripControlsFiltersElement, this._filterModel, this._tripItemsModel);
    this._filtersPresenter = filtersPresenter;
    this._filtersPresenter.init();
  }

  _clearFilter() {
    this._filtersPresenter.destroy();
  }

  _renderTripMain() {
    render(this._tripMainContainer, this._tripMain, RenderPosition.BEFOREEND);
    render(this._tripControlsNavigationElement, this._viewMenu, RenderPosition.BEFOREEND);
    this._renderFilter();
  }

  _clearTripInfo() {
    remove(this._tripPrice);
    remove(this._tripInfo);

    this._tripPrice = null;
    this._tripInfo = null;
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._clearTripInfo();
        this._renderTripInfo();
        break;
      case UpdateType.MINOR:
        this._clearFilter();
        this._renderFilter();

        this._clearTripInfo();
        this._renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this._clearFilter();
        this._renderFilter();

        this._clearTripInfo();
        this._renderTripInfo();
        break;
    }
  }
}
