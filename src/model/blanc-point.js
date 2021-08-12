import { TYPES } from '../const';

export default class BlancPoint {
  constructor() {
    this._pointData = {
      type: TYPES[0],
      dateFrom: undefined,
      dateTo: undefined,
      id: undefined,
      basePrice: undefined,
      offers: [],
      destination: undefined,
      isFavorite: false,
    };
  }

  get pointData() {
    return this._pointData;
  }
}
