import AbstractObservable from './abstract-observable';

export default class TripItems extends AbstractObservable {
  constructor() {
    super();
    this._tripItems = [];
  }

  set tripItems(items) {
    this._tripItems = items.slice();
  }

  get tripItems() {
    return this._tripItems;
  }
}
