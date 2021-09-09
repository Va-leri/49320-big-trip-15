import { tripItems } from './mock/trip-item-mock.js';
import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';
import TripItemsModel from './model/trip-items.js';
import FilterModel from './model/filter.js';
import { FilterType } from './const.js';

const tripItemsModel = new TripItemsModel();
tripItemsModel.tripItems = tripItems;

const defaultFilter = FilterType.EVERITHING;
const filterModel = new FilterModel(defaultFilter);

const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer, tripItemsModel, filterModel);
const tripMainPresenter = new TripMainPresenter(pageHeaderContainer, pageBodyContainer, tripItemsModel, filterModel, tripEventsPresenter);

tripMainPresenter.init();
tripEventsPresenter.init();
