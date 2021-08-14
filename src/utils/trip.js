import dayjs from 'dayjs';

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
