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
import { CITIES, TYPES, KeyCode, RenderPosition } from './const.js';
import { render, replace } from './utils/render.js';

const siteMainElement = document.querySelector('.page-main');
const siteMainContainerElement = siteMainElement.querySelector('.page-body__container');
const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');


render(tripControlsNavigationElement, new ViewMenuView, RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new FiltersView, RenderPosition.BEFOREEND);

const renderTripItem = (itemsList, item) => {
  const tripItemComponent = new TripItemView(item);
  const tripItemEditionComponent = new TripItemEditionView(item, offersByType, TYPES, CITIES);

  const replaceFormToItem = () => {
    replace(tripItemComponent, tripItemEditionComponent);
  };

  const onTripItemFormEscPress = (evt) => {
    if (evt.keyCode === KeyCode.ESC) {
      evt.preventDefault();
      replaceFormToItem();
      document.removeEventListener('keydown', onTripItemFormEscPress);
    }
  };

  const replaceItemToForm = () => {
    replace(tripItemEditionComponent, tripItemComponent);
    document.addEventListener('keydown', onTripItemFormEscPress);
  };

  tripItemComponent.setRollupBtnClickHandler(() => {
    replaceItemToForm();
  });

  tripItemEditionComponent.setFormSubmitHadler(() => {
    replaceFormToItem();
    document.removeEventListener('keydown', onTripItemFormEscPress);
  });

  tripItemEditionComponent.setRollupBtnClickHandler(() => {
    replaceFormToItem();
    document.removeEventListener('keydown', onTripItemFormEscPress);
  });

  render(itemsList, tripItemComponent, RenderPosition.BEFOREEND);
};

const fillTripItemsList = (itemsList, items) => {
  items.forEach((item) => {
    renderTripItem(itemsList, item);
  });
};

const renderTripInfo = (items) => {
  const tripInfoComponent = new TripInfoView(tripItems);

  render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);

  render(tripInfoComponent, new TripPriceView(items), RenderPosition.BEFOREEND);
};

const renderTripEvents = (items) => {
  const tripEventsComponent = new TripEventsView();
  const tripItemsListComponent = new TripItemsListView();

  render(siteMainContainerElement, tripEventsComponent, RenderPosition.BEFOREEND);

  if (tripItems.every((item) => !item)) {
    render(tripEventsComponent, new NoPointsView, RenderPosition.BEFOREEND);
  } else {
    render(tripEventsComponent, new TripSortView, RenderPosition.BEFOREEND);
    render(tripEventsComponent, tripItemsListComponent, RenderPosition.BEFOREEND);

    fillTripItemsList(tripItemsListComponent.getElement(), items);
  }
};

renderTripEvents(tripItems);
if (tripItems.length) {
  renderTripInfo(tripItems);
}
