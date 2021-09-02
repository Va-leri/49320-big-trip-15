export const isFutureEvent = (item) => (item.dateFrom - new Date()) >= 0;

export const isPastEvent = (item) => (item.dateTo - new Date()) < 0;
