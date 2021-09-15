import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, formatString) => dayjs(date).format(formatString);

export const updateItem = (items, newItem) => {
  const index = items.findIndex((item) => item.id === newItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    newItem,
    ...items.slice(index + 1),
  ];
};

export const getUniqueItems = (items) => [...new Set(items)];

export const isOnline = () => window.navigator.onLine;
