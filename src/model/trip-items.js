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

  updateItem(updateType, newItem) {
    const index = this._tripItems.findIndex((item) => item.id === newItem.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip point');
    }

    this._tripItems = [
      ...this._tripItems.slice(0, index),
      newItem,
      ...this._tripItems.slice(index + 1),
    ];

    this._notify(updateType, newItem);
  }

  addItem(updateType, newItem) {
    this._tripItems.push(newItem);

    this._notify(updateType, newItem);
  }

  deleteItem(updateType, newItem) {
    const index = this._tripItems.findIndex((item) => item.id === newItem.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._tripItems.splice(index);

    this._notify(updateType, newItem);
  }
}
