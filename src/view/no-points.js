import AbstractView from './abstract';
import { FilterType } from '../const';

const NoTripItemsText = {
  [FilterType.EVERITHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointsTemplate = (activeFilterType) => (
  `<p class="trip-events__msg">${NoTripItemsText[activeFilterType]}</p>`
);

export default class NoPoints extends AbstractView {
  constructor(activeFilterType) {
    super();
    this._activeFilter = activeFilterType;
  }

  getTemplate() {
    return createNoPointsTemplate(this._activeFilter);
  }
}
