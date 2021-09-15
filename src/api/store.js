export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(storeKeyPostfix) {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}-${storeKeyPostfix}`)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, storeKeyPostfix) {
    this._storage.setItem(
      `${this._storeKey}-${storeKeyPostfix}`,
      JSON.stringify(items),
    );
  }

  setItem(key, value, storeKeyPostfix) {
    const store = this.getItems(storeKeyPostfix);

    this._storage.setItem(
      `${this._storeKey}-${storeKeyPostfix}`,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(key, storeKeyPostfix) {
    const store = this.getItems(storeKeyPostfix);

    delete store[key];

    this._storage.setItem(
      `${this._storeKey}-${storeKeyPostfix}`,
      JSON.stringify(store),
    );
  }
}
