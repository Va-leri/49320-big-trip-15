import TripItemsModel from '../model/trip-items';
import { isOnline } from '../utils/common';

const Postfix = {
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
  POINTS: 'points',
};

const ItemsType = {
  DESTINATIONS: 'DESTINATIONS',
  OFFERS: 'OFFERS',
  POINTS: 'POINTS',
};

const dataToKeyName = {
  DESTINATIONS: 'name',
  OFFERS: 'type',
  POINTS: 'id',
};

const createStoreStructure = (items, keyName) => items.reduce((obj, current) => Object.assign({}, obj, { [current[keyName]]: current }), {});

const getSyncedPoints = (items) =>
  items
    .filter(({ success }) => success)
    .map(({ payload }) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncNeeded = false;
  }

  set isSyncNeeded(boolean) {
    this._isSyncNeeded = boolean;
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  _getItems(itemsType) {
    const postfix = Postfix[itemsType];

    if (isOnline()) {
      return this._api.getPoints()
        .then((items) => {
          if (itemsType === ItemsType.POINTS) {
            items = items.map(TripItemsModel.adaptToServer);
          }

          const formattedItems = createStoreStructure(items, dataToKeyName[itemsType]);
          this._store.setItems(formattedItems, postfix);
          return items;
        });
    }
    const storePoints = Object.values(this._store.getItems(postfix));

    return Promise.resolve(storePoints.map(TripItemsModel.adaptToClient));
  }

  getDestinations() {
    return this._getItems(ItemsType.DESTINATIONS);
  }

  getOffers() {
    return this._getItems(ItemsType.OFFERS);
  }

  getPoints() {
    return this._getItems(ItemsType.POINTS);
  }

  updatePoint(point) {
    const postfix = Postfix.POINTS;

    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(
            updatedPoint[dataToKeyName.POINTS],
            TripItemsModel.adaptToServer(updatedPoint),
            postfix,
          );
          return updatedPoint;
        });
    }

    if (!this._isSyncNeeded) {
      this._isSyncNeeded = true;
    }

    this._store.setItem(
      point[dataToKeyName.POINTS],
      TripItemsModel.adaptToServer(point),
      postfix,
    );

    return Promise.resolve(point);
  }

  addNewPoint(point) {
    const postfix = Postfix.POINTS;

    if (isOnline()) {
      return this._api.addNewPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint[dataToKeyName.POINTS], TripItemsModel.adaptToServer(newPoint), postfix);
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    const postfix = Postfix.POINTS;

    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => {
          this._store.removeItem(point[dataToKeyName.POINTS], postfix);
        });
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems(Postfix.POINTS));


      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints], dataToKeyName.POINTS);

          this._store.setItems(items, Postfix.POINTS);
        }).then(() => { this._isSyncNeeded = false; });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
