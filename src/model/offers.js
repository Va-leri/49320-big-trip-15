import AbstractObservable from './abstract-observable';

export default class Offers extends AbstractObservable {
  constructor() {
    super();
    this._offers = [];
  }

  set offers(offersArr) {
    this._offers = offersArr.slice();
  }

  get offers() {
    return this._offers;
  }
}
