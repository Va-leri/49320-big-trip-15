import dayjs from 'dayjs';

export const formatDate = (days, hours, minutes) => {
  const duration = {
    D: days,
    H: hours - days * 24,
    M: minutes - hours * 60,
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

export const getPointDuration = (from, to) => {
  const durationInDays = dayjs(to).diff(dayjs(from), 'd');
  const durationInHours = dayjs(to).diff(dayjs(from), 'h');
  const durationInMinutes = dayjs(to).diff(dayjs(from), 'm');

  return formatDate(durationInDays, durationInHours, durationInMinutes);
};
