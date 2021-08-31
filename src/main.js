import { tripItems as tripItemsMock } from './mock/trip-item-mock.js';
import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';
import TripItemsModel from './model/trip-items.js';

const tripItemsModel = new TripItemsModel();
tripItemsModel.tripItems = tripItemsMock;
const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const tripMainPresenter = new TripMainPresenter(pageHeaderContainer, tripItemsModel);
tripMainPresenter.init();

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer, tripItemsModel);
tripEventsPresenter.init();
