import { render } from '../utils/render.js';
import { RenderPosition } from '../const.js';
import TripMainView from '../view/trip-main.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import ViewMenuView from '../view/view-menu.js';
import FiltersView from '../view/filters.js';

export default class TripMain {
  constructor(tripMainContainer, tripItemsModel) {
    this._tripItemsModel = tripItemsModel;
    this._tripMainContainer = tripMainContainer;
    this._tripMain = new TripMainView;
    this._viewMenu = new ViewMenuView;
    this._filtersForm = new FiltersView;
    this._tripInfo;
    this._tripPrice;
    this._tripControlsNavigationElement = this._tripMain.getElement().querySelector('.trip-controls__navigation');
    this._tripControlsFiltersElement = this._tripMain.getElement().querySelector('.trip-controls__filters');
  }

  init() {
    this._tripPrice = new TripPriceView(this._getTripItems());
    this._tripInfo = new TripInfoView(this._getTripItems());
    this._renderTripMain();
    if (this._getTripItems().length) {
      this._renderTripInfo();
    }
  }

  _getTripItems() {
    return this._tripItemsModel.tripItems;
  }

  _renderTripInfo() {
    render(this._tripMain.getElement(), this._tripInfo, RenderPosition.AFTERBEGIN);

    render(this._tripInfo, this._tripPrice, RenderPosition.BEFOREEND);
  }

  _renderTripMain() {
    render(this._tripMainContainer, this._tripMain, RenderPosition.BEFOREEND);
    render(this._tripControlsNavigationElement, this._viewMenu, RenderPosition.BEFOREEND);
    render(this._tripControlsFiltersElement, this._filtersForm, RenderPosition.BEFOREEND);
  }
}
