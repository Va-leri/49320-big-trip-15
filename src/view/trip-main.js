import AbstractView from './abstract';

const createTripMainTemplate = () => (`<div class="trip-main">
        <!-- Маршрут и стоимость -->

        <div class="trip-main__trip-controls  trip-controls">
          <div class="trip-controls__navigation">
            <h2 class="visually-hidden">Switch trip view</h2>
            <!-- Меню -->
          </div>

          <div class="trip-controls__filters">
            <h2 class="visually-hidden">Filter events</h2>
            <!-- Фильтры -->
          </div>
        </div>

        <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
      </div>`);

export default class TripMain extends AbstractView {
  getTemplate() {
    return createTripMainTemplate();
  }
}
