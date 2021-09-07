import AbstractObservable from './abstract-observable';

export default class Filter extends AbstractObservable {
  constructor(activeFilter) {
    super();
    this._activeFilter = activeFilter;
  }

  set activeFilter(type) {
    this._activeFilter = type;
  }

  get activeFilter() {
    return this._activeFilter;
  }

  setActiveFilter(updateType, filterType) {
    this.activeFilter = filterType;
    this._notify(updateType, filterType);
  }
}
