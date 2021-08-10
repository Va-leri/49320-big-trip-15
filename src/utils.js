import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, formatString) => dayjs(date).format(formatString);

export const getPointDuration = (from, to) => {
  const durationInDays = dayjs(to).diff(dayjs(from), 'd');
  const durationInHours = dayjs(to).diff(dayjs(from), 'h');
  const durationInMinutes = dayjs(to).diff(dayjs(from), 'm');

  const duration = {
    D: durationInDays,
    get H() {
      return durationInHours - this.D * 24;
    },
    get M() {
      return durationInMinutes - this.D * 24 * 60 - this.H * 60;
    },
  };

  const formatedDuration = Object.entries(duration).map(([units, value]) => {
    if (value) {
      if (value < 10) {
        value = `0${value}`;
      }
      return `${value}${units} `;
    }
  }).join('');

  return formatedDuration;
};
