export const isFutureEvent = (item) => (item.dateFrom - new Date()) >= 0;

export const isPastEvent = (item) => (item.dateTo - new Date()) < 0;

export const areDatesEqual = (newItem, oldItem) => (newItem.dateFrom === oldItem.dateFrom && newItem.dateTo === oldItem.dateTo);
