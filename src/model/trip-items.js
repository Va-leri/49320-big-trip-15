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

  setItems(updateType, items) {
    this.tripItems = items;
    this._notify(updateType);
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

  static adaptToClient(item) {
    const adaptedItem = Object.assign({}, item, {
      basePrice: item['base_price'],
      dateFrom: item['date_from'] ? new Date(item['date_from']) : item['date_from'],
      dateTo: item['date_to'] ? new Date(item['date_to']) : item['date_to'],
      isFavorite: item['is_favorite'],
    });

    delete adaptedItem['base_price'];
    delete adaptedItem['date_from'];
    delete adaptedItem['date_to'];
    delete adaptedItem['is_favorite'];

    return adaptedItem;
  }

  static adaptToServer(item) {
    const adaptedItem = Object.assign({}, item, {
      'base_price': item.basePrice,
      'date_from': item.dateFrom instanceof Date ? item.dateFrom.toISOString() : null,
      'date_to': item.dateTo instanceof Date ? item.dateTo.toISOString() : null,
      'is_favorite': item.isFavorite,
    });

    delete adaptedItem.basePrice;
    delete adaptedItem.dateFrom;
    delete adaptedItem.dateTo;
    delete adaptedItem.isFavorite;

    return adaptedItem;
  }
}
