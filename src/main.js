import { tripItems, offersByType } from './mock/trip-item-mock.js';
import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';
import TripItemsModel from './model/trip-items.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import { FilterType } from './const.js';

const tripItemsModel = new TripItemsModel();
tripItemsModel.tripItems = tripItems;

const offersModel = new OffersModel();
offersModel.offers = offersByType;

const defaultFilter = FilterType.EVERITHING;
const filterModel = new FilterModel(defaultFilter);

const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const tripMainPresenter = new TripMainPresenter(pageHeaderContainer, tripItemsModel, filterModel);
tripMainPresenter.init();

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer, tripItemsModel, filterModel, offersModel);
tripEventsPresenter.init();
