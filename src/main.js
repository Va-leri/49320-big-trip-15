import { viewMenu } from './view/view-menu.js';
import { filters } from './view/filters.js';
import { tripInfo } from './view/trip-info.js';
import { tripPrice } from './view/trip-price.js';
import { tripSort } from './view/trip-sort.js';
import { tripItemsList } from './view/trip-items-list.js';
import { tripItem } from './view/trip-item.js';
import { tripItemEdition } from './view/trip-item-edition.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');

const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

render(tripMainElement, tripInfo(), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');

render(tripInfoElement, tripPrice(), 'beforeend');

render(tripControlsNavigationElement, viewMenu(), 'beforeend');
render(tripControlsFiltersElement, filters(), 'beforeend');

const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripEventsElement, tripSort(), 'beforeend');
render(tripEventsElement, tripItemsList(), 'beforeend');

const tripItemsListElement = tripEventsElement.querySelector('.trip-events__list');
const TRIP_ITEMS_ON_PAGE = 3;

for (let i = 0; i < TRIP_ITEMS_ON_PAGE; i++) {
  render(tripItemsListElement, tripItem(), 'beforeend');
}

render(tripItemsListElement, tripItemEdition(), 'afterbegin');
