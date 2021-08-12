import ViewMenuView from './view/view-menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import TripPriceView from './view/trip-price.js';
import TripSortView from './view/trip-sort.js';
import TripItemsListView from './view/trip-items-list.js';
import TripItemView from './view/trip-item.js';
import TripItemEditionView from './view/trip-item-edition.js';
import { tripItems, offersByType } from './model/trip-item-mock.js';
import { CITIES, TYPES } from './const.js';
import { render, RenderPosition } from './utils.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const tripInfoComponent = new TripInfoView(tripItems);

render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

render(tripInfoComponent.getElement(), new TripPriceView(tripItems).getElement(), RenderPosition.BEFOREEND);

render(tripControlsNavigationElement, new ViewMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripEventsElement, new TripSortView().getElement(), RenderPosition.BEFOREEND);

const tripItemsListComponent = new TripItemsListView();
render(tripEventsElement, tripItemsListComponent.getElement(), RenderPosition.BEFOREEND);

const renderTripItem = (item) => {
  const tripItemComponent = new TripItemView(item);
  const tripItemEditionComponent = new TripItemEditionView(item, offersByType, TYPES, CITIES);

  const tripItemRoollupBtn = tripItemComponent.getElement().querySelector('.event__rollup-btn');
  const tripItemEditionForm = tripItemEditionComponent.getElement().querySelector('form');

  const replaceItemToForm = () => {
    tripItemsListComponent.getElement().replaceChild(tripItemEditionComponent.getElement(), tripItemComponent.getElement());
  };
  const replaceFormToItem = () => {
    tripItemsListComponent.getElement().replaceChild(tripItemComponent.getElement(), tripItemEditionComponent.getElement());
  };

  render(tripItemsListComponent.getElement(), tripItemComponent.getElement(), RenderPosition.BEFOREEND);

  tripItemRoollupBtn.addEventListener('click', () => {
    replaceItemToForm();
  });

  tripItemEditionForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToItem();
  });
};

const fillTripItemsList = (items) => {
  items.forEach((item) => {
    renderTripItem(item);
  });
};

fillTripItemsList(tripItems);
