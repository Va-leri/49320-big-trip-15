import viewMenuView from './view/view-menu.js';
import filtersView from './view/filters.js';
import tripInfoView from './view/trip-info.js';
import tripPriceView from './view/trip-price.js';
import tripSortView from './view/trip-sort.js';
import tripItemsListView from './view/trip-items-list.js';
import tripItemView from './view/trip-item.js';
import tripItemEditionView from './view/trip-item-edition.js';
import { generateTripItem, offersByType } from './model/trip-item-mock.js';
import { CITIES, TYPES } from './const.js';
import { render, RenderPosition } from './utils.js';
// import tripItemsList from './view/trip-items-list.js';

const TRIP_POINTS_COUNT = 15;
// const TRIP_ITEMS_ON_PAGE = 15;

const tripPoints = new Array(TRIP_POINTS_COUNT).fill().map((id) => generateTripItem(id));

// console.log(tripPoints);

// const renderTemplate = (container, template, place) => {
//   container.insertAdjacentHTML(place, template);
// };

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const tripInfoComponent = new tripInfoView(tripPoints);

render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

render(tripInfoComponent.getElement(), new tripPriceView(tripPoints).getElement(), RenderPosition.BEFOREEND);

render(tripControlsNavigationElement, new viewMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new filtersView().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripEventsElement, new tripSortView().getElement(), RenderPosition.BEFOREEND);

const tripItemsListComponent = new tripItemsListView();
render(tripEventsElement, tripItemsListComponent.getElement(), RenderPosition.BEFOREEND);

const renderTripItem = (item) => {
  const tripItemComponent = new tripItemView(item);
  const tripItemEditionComponent = new tripItemEditionView(item, offersByType, TYPES, CITIES);

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
  // render(tripItemsListComponent.getElement(), new tripItemEditionView(firstPoint, offersByType, TYPES, CITIES).getElement(), RenderPosition.AFTERBEGIN);
  items.forEach((item) => {
    renderTripItem(item);
    /* const tripItemComponent = new tripItemView(item);
    const tripItemEditionComponent = new tripItemEditionView(item, offersByType, TYPES, CITIES);

    const tripItemRoollupBtn = tripItemComponent.getElement().querySelector('.event__rollup-btn');
    const tripItemEditionForm = tripItemEditionComponent.getElement().querySelector('form');

    const onTripItemEditionFormSubmit = () => {
      tripItemEditionForm.removeEventListener('submit', onTripItemEditionFormSubmit);

      tripItemsListComponent.getElement().replaceChild(tripItemComponent.getElement(), tripItemEditionComponent.getElement());
    };

    render(tripItemsListComponent.getElement(), tripItemComponent.getElement(), RenderPosition.BEFOREEND);

    tripItemRoollupBtn.addEventListener('click', () => {
      tripItemsListComponent.getElement().replaceChild(tripItemEditionComponent.getElement(), tripItemComponent.getElement());

      tripItemEditionForm.addEventListener('submit', onTripItemEditionFormSubmit);
    }); */
  });
};

fillTripItemsList(tripPoints);
