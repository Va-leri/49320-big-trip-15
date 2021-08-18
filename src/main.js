import { tripItems } from './model/trip-item-mock.js';
import TripMainPresenter from './presenter/trip-main.js';
import TripEventsPresenter from './presenter/trip-events.js';

const pageMainElement = document.querySelector('.page-main');
const pageBodyContainer = pageMainElement.querySelector('.page-body__container');
const pageHeaderElement = document.querySelector('.page-header');
const pageHeaderContainer = pageHeaderElement.querySelector('.page-header__container');

const tripMainPresenter = new TripMainPresenter(pageHeaderContainer);
tripMainPresenter.init(tripItems);

const tripEventsPresenter = new TripEventsPresenter(pageBodyContainer);
tripEventsPresenter.init(tripItems);
