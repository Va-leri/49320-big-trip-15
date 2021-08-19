export const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const CITIES = ['Amsterdam', 'Chamonix', 'Moscow', 'Tokyo', 'New York', 'Bugulma'];

export const TRIP_ITEMS_COUNT = 15;

export const BLANC_POINT = {
  type: TYPES[0],
  dateFrom: undefined,
  dateTo: undefined,
  id: undefined,
  basePrice: undefined,
  offers: [],
  destination: undefined,
  isFavorite: false,
};

export const KeyCode = {
  ESC: 27,
  ENTER: 13,
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
