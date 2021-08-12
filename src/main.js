import ViewMenuView from './view/view-menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import TripPriceView from './view/trip-price.js';
import TripSortView from './view/trip-sort.js';
import TripItemsListView from './view/trip-items-list.js';
import TripItemView from './view/trip-item.js';
import TripItemEditionView from './view/trip-item-edition.js';
import NoPointsView from './view/no-points.js';
import TripEventsView from './view/tripEvents.js';
import { tripItems, offersByType } from './model/trip-item-mock.js';
import { CITIES, TYPES, KeyCode } from './const.js';
import { render, RenderPosition } from './utils.js';

const siteMainElement = document.querySelector('.page-main');
const siteMainContainerElement = siteMainElement.querySelector('.page-body__container');
const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');


render(tripControlsNavigationElement, new ViewMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const renderTripItem = (itemsList, item) => {
  const tripItemComponent = new TripItemView(item);
  const tripItemEditionComponent = new TripItemEditionView(item, offersByType, TYPES, CITIES);

  const tripItemRoollupBtn = tripItemComponent.getElement().querySelector('.event__rollup-btn');
  const tripItemEditionForm = tripItemEditionComponent.getElement().querySelector('form');
  const tripItemFormRollupBtn = tripItemEditionForm.querySelector('.event__rollup-btn');

  const replaceFormToItem = () => {
    itemsList.replaceChild(tripItemComponent.getElement(), tripItemEditionComponent.getElement());
  };

  const onTripItemFormEscPress = (evt) => {
    if (evt.keyCode === KeyCode.ESC) {
      evt.preventDefault();
      replaceFormToItem();
      document.removeEventListener('keydown', onTripItemFormEscPress);
    }
  };

  const replaceItemToForm = () => {
    itemsList.replaceChild(tripItemEditionComponent.getElement(), tripItemComponent.getElement());
    document.addEventListener('keydown', onTripItemFormEscPress);
  };

  tripItemRoollupBtn.addEventListener('click', () => {
    replaceItemToForm();
  });

  tripItemEditionForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToItem();
    document.removeEventListener('keydown', onTripItemFormEscPress);
  });

  tripItemFormRollupBtn.addEventListener('click', () => {
    replaceFormToItem();
    document.removeEventListener('keydown', onTripItemFormEscPress);
  });

  render(itemsList, tripItemComponent.getElement(), RenderPosition.BEFOREEND);
};

const fillTripItemsList = (itemsList, items) => {
  items.forEach((item) => {
    renderTripItem(itemsList, item);
  });
};

const renderTripInfo = (items) => {
  const tripInfoComponent = new TripInfoView(tripItems);

  render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

  render(tripInfoComponent.getElement(), new TripPriceView(items).getElement(), RenderPosition.BEFOREEND);
};

const renderTripEvents = (items) => {
  const tripEventsComponent = new TripEventsView();
  const tripItemsListComponent = new TripItemsListView();

  render(siteMainContainerElement, tripEventsComponent.getElement(), RenderPosition.BEFOREEND);

  if (tripItems.every((item) => !item)) {
    render(tripEventsComponent.getElement(), new NoPointsView().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(tripEventsComponent.getElement(), new TripSortView().getElement(), RenderPosition.BEFOREEND);
    render(tripEventsComponent.getElement(), tripItemsListComponent.getElement(), RenderPosition.BEFOREEND);

    fillTripItemsList(tripItemsListComponent.getElement(), items);
  }
};

renderTripEvents(tripItems);
if (tripItems.length) {
  renderTripInfo(tripItems);
}
