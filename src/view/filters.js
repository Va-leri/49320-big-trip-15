import AbstractView from './abstract';

const createFilterItemTemplate = (filter, activeFilterType) => (
  `<div class="trip-filters__filter">
      <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${filter.type === activeFilterType ? 'checked' : ''} ${!filter.count ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
    </div>`
);

const createFiltersTemplate = (filters, activeFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, activeFilter)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);


export default class Filters extends AbstractView {
  constructor(filters, activeFilterType) {
    super();
    this._filters = filters;
    this._activeFilterType = activeFilterType;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._activeFilterType);
  }

  _onFilterTypeChange(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const filterType = evt.target.value;
    this._callback.changeType(filterType);
  }

  setChangeFilterTypeHandler(callback) {
    this._callback.changeType = callback;
    this.getElement().addEventListener('click', this._onFilterTypeChange);
  }
}
