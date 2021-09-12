import TripItemsModel from './model/trip-items';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};


export default class Api {
  constructor(endpoint, authorization) {
    this._endpoint = endpoint;
    this._authorization = authorization;
  }

  getDestinations() {
    return this._load({ url: 'destinations' })
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({ url: 'offers' })
      .then(Api.toJSON)
      .then((offers) => offers);
  }

  getPoints() {
    return this._load({ url: 'points' })
      .then(Api.toJSON)
      .then((points) => points.map((point) => TripItemsModel.adaptToClient(point)));
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(TripItemsModel.adaptToServer(point)),
    })
      .then(Api.toJSON)
      .then(TripItemsModel.adaptToClient);
  }

  addNewPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(TripItemsModel.adaptToServer(point)),
    })
      .then(Api.toJSON)
      .then(TripItemsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  }

  _load({
    url,
    method = Method.GET,
    headers = new Headers(),
    body = null,
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endpoint}/${url}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.text}`);
    }

    return response;
  }

  static catchError(err) {
    throw err;
  }

  static toJSON(response) {
    return response.json();
  }
}
