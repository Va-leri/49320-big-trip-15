import { render, remove } from '../utils/render.js';
import { RenderPosition, UpdateType, MenuItem, FilterType } from '../const.js';
import TripMainView from '../view/trip-main.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import ViewMenuView from '../view/view-menu.js';
import FiltersView from '../view/filters.js';
import FiltersPresenter from './filters.js';
import StatisticsView from '../view/statistics.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';


export default class TripMain {
  constructor(tripMainContainer, pageBodyContainer, tripItemsModel, filterModel, tripEventsPresenter) {
    this._tripEventsPresenter = tripEventsPresenter;
    this._tripItemsModel = tripItemsModel;
    this._filterModel = filterModel;
    this._filtersPresenter = null;
    this._tripMainContainer = tripMainContainer;
    this._pageBodyContainer = pageBodyContainer;
    this._tripMain = new TripMainView;
    this._viewMenu = new ViewMenuView;
    this._filtersForm = new FiltersView;
    this._tripInfo = null;
    this._tripPrice = null;
    this._statisticsComponent = null;
    this._isLoading = true;

    this._tripControlsNavigationElement = this._tripMain.getElement().querySelector('.trip-controls__navigation');
    this._tripControlsFiltersElement = this._tripMain.getElement().querySelector('.trip-controls__filters');
    this._addNewPointBtn = this._tripMain.getElement().querySelector('.trip-main__event-add-btn');

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleAddNewPointClose = this._handleAddNewPointClose.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._addNewPointClickHandler = this._addNewPointClickHandler.bind(this);

    this._tripItemsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripMain();
    this._renderTripInfo();

    this._viewMenu.setMenuClickHandler(this._handleSiteMenuClick);
    this._addNewPointBtn.addEventListener('click', this._addNewPointClickHandler);
  }

  _getTripItems() {
    return this._tripItemsModel.tripItems;
  }

  _renderTripInfo() {
    if (this._isLoading) {
      return;
    }

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

  _handleAddNewPointClose() {
    this._addNewPointBtn.disabled = false;

    // После сохранения переключиться на режим TABLE
    this._viewMenu.setActiveView(MenuItem.TABLE);
  }

  _addNewPointClickHandler() {
    this._handleSiteMenuClick(MenuItem.ADD_NEW_POINT);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_NEW_POINT:

        // Скрыть статистику
        remove(this._statisticsComponent);

        // Скрыть доску
        this._tripEventsPresenter.destroy();

        // Показать доску
        this._tripEventsPresenter.init();

        if (!isOnline()) {
          toast('You can\'t create new trip point offline');
          this._viewMenu.setActiveView(MenuItem.TABLE);
          break;
        }

        // Показать форму добавления точки
        this._tripEventsPresenter.createTripItem(this._handleAddNewPointClose);
        this._viewMenu.setActiveView(MenuItem.ADD_NEW_POINT);

        // Заблокировать кнопку добавления новой точки
        this._addNewPointBtn.disabled = true;
        break;
      case MenuItem.TABLE:

        // Скрыть статистику
        remove(this._statisticsComponent);

        // Скрыть доску
        this._tripEventsPresenter.destroy();

        // Показать доску
        this._tripEventsPresenter.init();

        // Установить соотв. пункт меню
        this._viewMenu.setActiveView(MenuItem.TABLE);

        // Сбросить фильтр
        this._filterModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERITHING);

        break;
      case MenuItem.STATISTICS:

        // Скрыть доску
        this._tripEventsPresenter.destroy();

        // Показать статистику
        this._statisticsComponent = new StatisticsView(this._tripItemsModel.tripItems);
        render(this._pageBodyContainer, this._statisticsComponent, RenderPosition.BEFOREEND);

        // Установить соотв. пункт меню
        this._viewMenu.setActiveView(MenuItem.STATISTICS);

        // Заблокировать фильтры
        this._filtersPresenter.disableFilters();
        break;
    }
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

      case UpdateType.INIT:
        this._isLoading = false;

        this._clearFilter();
        this._renderFilter();

        this._renderTripInfo();

        break;
    }
  }
}
