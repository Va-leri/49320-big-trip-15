import { RenderPosition, UpdateType } from '../const.js';
import { render, remove } from '../utils/render.js';
import FiltersView from '../view/filters.js';
import { FILTERS } from '../const.js';
import { filterItems } from '../utils/filter.js';

export default class Filters {
  constructor(container, filterModel, tripItemsModel) {
    this._filterModel = filterModel;
    this._tripItemsModel = tripItemsModel;
    this._filtersContainer = container;
    this._activeFilterType = filterModel.activeFilter;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    const filters = this._getFilters();

    this._filtersComponent = new FiltersView(filters, this._activeFilterType);

    render(this._filtersContainer, this._filtersComponent, RenderPosition.BEFOREEND);
    this._filtersComponent.setChangeFilterTypeHandler(this._handleFilterTypeChange);
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setActiveFilter(UpdateType.MAJOR, filterType);
  }


  _getFilters() {
    const tripItems = this._tripItemsModel.tripItems;

    return FILTERS.map((filter) => Object.assign({}, filter, {
      count: filterItems[filter.type](tripItems).length,
    }));
  }

  destroy() {
    remove(this._filtersComponent);

    this._filtersComponent = null;
  }

  disableFilters() {
    this._filtersComponent.disableFilters();
  }

  /* enableFilters() {
    this._filtersComponent.enableFilters();
   }
   */
}
