import AbstractObservable from './abstract-observable';

export default class Offers extends AbstractObservable {
  constructor() {
    super();
    this._offers = [];
  }

  set offers(items) {
    this._offers = items.slice();
  }

  get offers() {
    return this._offers;
  }
}
