// import { tripItems } from './mock/trip-item-mock.js';
import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';
import TripItemsModel from './model/trip-items.js';
import FilterModel from './model/filter.js';
import { FilterType, UpdateType } from './const.js';
import Api from './api.js';
// import { destinations } from './mock/trip-item-mock.js';

const ENDPOINT = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic r32esdseqslft8rff';
const defaultFilter = FilterType.EVERITHING;

const tripItemsModel = new TripItemsModel();
const filterModel = new FilterModel(defaultFilter);

const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const api = new Api(ENDPOINT, AUTHORIZATION);

const destinations = [];
const offersByType = [];

api.getDestinations().then((result) => {
  destinations.push(...result);
});
api.getOffers().then((result) => {
  offersByType.push(...result);
});

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer, tripItemsModel, filterModel, api);
const tripMainPresenter = new TripMainPresenter(pageHeaderContainer, pageBodyContainer, tripItemsModel, filterModel, tripEventsPresenter);

tripMainPresenter.init();
tripEventsPresenter.init();

api.getPoints().then((points) => {
  tripItemsModel.setItems(UpdateType.INIT, points);
})
  .catch(() => {
    tripItemsModel.setItems(UpdateType.INIT, []);
  });

export { destinations, offersByType };
