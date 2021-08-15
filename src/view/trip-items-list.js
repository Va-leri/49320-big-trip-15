import AbstractView from './abstract';

const createTripItemsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripItemsList extends AbstractView {
  getTemplate() {
    return createTripItemsListTemplate();
  }
}
