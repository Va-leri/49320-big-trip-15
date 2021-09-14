import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';
import TripItemsModel from './model/trip-items.js';
import FilterModel from './model/filter.js';
import { FilterType, UpdateType } from './const.js';
import Api from './api/api.js';
import Provider from './api/provider.js';
import Store from './api/store.js';

const ENDPOINT = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic r32eddrwseqsftf';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const defaultFilter = FilterType.EVERITHING;

const tripItemsModel = new TripItemsModel();
const filterModel = new FilterModel(defaultFilter);

const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const api = new Api(ENDPOINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const destinations = [];
const offersByType = [];

apiWithProvider.getDestinations().then((result) => {
  destinations.push(...result);
});
apiWithProvider.getOffers().then((result) => {
  offersByType.push(...result);
});

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer, tripItemsModel, filterModel, apiWithProvider);
const tripMainPresenter = new TripMainPresenter(pageHeaderContainer, pageBodyContainer, tripItemsModel, filterModel, tripEventsPresenter);

tripMainPresenter.init();
tripEventsPresenter.init();

apiWithProvider.getPoints().then((points) => {
  tripItemsModel.setItems(UpdateType.INIT, points);
})
  .catch(() => {
    tripItemsModel.setItems(UpdateType.INIT, []);
  });

export { destinations, offersByType };

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  if (apiWithProvider.isSyncNeeded) {
    apiWithProvider.sync();
  }
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
