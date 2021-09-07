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

  updateItem(updateType, updatedItem) {
    const index = this._tripItems.findIndex((item) => item.id === updatedItem.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip point');
    }

    this._tripItems = [
      ...this._tripItems.slice(0, index),
      updatedItem,
      ...this._tripItems.slice(index + 1),
    ];

    this._notify(updateType, updatedItem);
  }

  addItem(updateType, newItem) {
    this._tripItems.push(newItem);

    this._notify(updateType, newItem);
  }

  deleteItem(updateType, deletedItem) {
    const index = this._tripItems.findIndex((item) => item.id === deletedItem.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._tripItems.splice(index, 1);

    this._notify(updateType, deletedItem);
  }
}
