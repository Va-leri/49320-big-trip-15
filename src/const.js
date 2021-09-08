export const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const CITIES = ['Amsterdam', 'Chamonix', 'Moscow', 'Tokyo', 'New York', 'Bugulma'];

export const TRIP_ITEMS_COUNT = 15;

export const BLANC_POINT = {
  type: TYPES[0],
  dateFrom: undefined,
  dateTo: undefined,
  id: undefined,
  basePrice: '',
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

export const UserAction = {
  UPDATE_TRIP_POINT: 'UPDATE_TRIP_POINT',
  ADD_TRIP_POINT: 'ADD_TRIP_POINT',
  DELETE_TRIP_POINT: 'DELETE_TRIP_POINT',
  CHANGE_ACTIVE_FILTER: 'CHANGE_ACTIVE_FILTER',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERITHING: 'everithing',
  PAST: 'past',
  FUTURE: 'future',
};

export const FILTERS = [
  {
    type: 'everithing',
    name: 'EVERITHING',
  },
  {
    type: 'past',
    name: 'PAST',
  },
  {
    type: 'future',
    name: 'FUTURE',
  },
];

export const MenuItem = {
  ADD_NEW_POINT: 'ADD_NEW_POINT',
  TABLE: 'TABLE',
  STATISTICS: 'STATISTICS',
};
