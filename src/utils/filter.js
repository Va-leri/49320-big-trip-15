import { FilterType } from '../const';
import { isFutureEvent, isPastEvent } from './trip-item';

export const filterItems = {
  [FilterType.EVERITHING]: (items) => items,
  [FilterType.FUTURE]: (items) => items.filter((item) => isFutureEvent(item)),
  [FilterType.PAST]: (items) => items.filter((item) => isPastEvent(item)),
};
