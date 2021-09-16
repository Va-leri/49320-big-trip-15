import dayjs from 'dayjs';

export const humanizeDate = (date, formatString) => dayjs(date).format(formatString);

export const getUniqueItems = (items) => [...new Set(items)];

export const isOnline = () => window.navigator.onLine;
