import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Amsterdam', 'Chamonix', 'Moscow', 'Tokyo', 'New York', 'Bugulma'];

const RANDOM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

const sentencesArr = RANDOM_TEXT.split('. ');


const generateRandomItem = (itemsArr) => {
  const randomIndex = getRandomInteger(0, itemsArr.length - 1);
  return itemsArr[randomIndex];
};

const generateDescription = () => {
  const MAX_DESCRIPTION_LENGTH = 5;

  const startIndex = getRandomInteger(0, sentencesArr.length - 1);
  const endIndex = startIndex < sentencesArr.length - 1 ? (
    getRandomInteger(startIndex + 1, sentencesArr.length - 1)) :
    undefined;
  const descriptionArr = sentencesArr.slice(startIndex, (endIndex - startIndex <= MAX_DESCRIPTION_LENGTH ? endIndex : startIndex + MAX_DESCRIPTION_LENGTH));
  return `${descriptionArr.join('. ')}.`;
};

const generateDates = () => {
  const startDayGap = getRandomInteger(0, 365) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
  const endDayGap = getRandomInteger(0, 30) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
  return {
    from: dayjs().add(startDayGap, 'minute').toDate(),
    to: dayjs().add(startDayGap + endDayGap, 'minute').toDate(),
  };
};

const generatePictures = () => {
  const number = getRandomInteger(1, 5);
  const photosArr = [];
  for (let i = 0; i < number; i++) {
    const src = `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`;
    const description = generateRandomItem(sentencesArr);
    photosArr.push({ src, description });
  }
  return photosArr;
};

const generateDestination = () => ({
  description: generateDescription(),
  name: generateRandomItem(CITIES),
  pictures: generatePictures(),
});

const offersTitles = ['Choose meal', 'Choose seat', 'Upgrade to comfort', 'Add luggage', 'Add massage'];

const generateOffers = () => {
  const generateOffer = () => ({
    title: generateRandomItem(offersTitles),
    price: getRandomInteger(0, 1000),
  });

  const getOffersArr = () => {
    const getOffersCount = getRandomInteger(2, offersTitles.length);
    return new Array(getOffersCount).fill().map(generateOffer);
  };

  return TYPES.map((type) => ({
    type,
    offers: getOffersArr(),
  }));
};

const offersByType = generateOffers();

const generateItemOffers = (currentType) => {
  const availabelOffers = offersByType.find(({ type }) => type === currentType).offers;
  const offersNumber = getRandomInteger(1, availabelOffers.length);
  const offers = new Array(offersNumber).fill().map(() => generateRandomItem(availabelOffers));
  return offers;
};

const generateTripItem = () => {
  // const isDestination = Boolean(getRandomInteger(0, 1));
  const isDestination = true;
  const areOffers = Boolean(getRandomInteger(0, 1));
  const type = generateRandomItem(TYPES);

  return {
    type,
    dates: generateDates(),
    basePrice: getRandomInteger(0, 5000),
    offers: areOffers ? generateItemOffers(type) : null,
    destination: isDestination ? generateDestination() : undefined,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export { generateTripItem, offersByType, TYPES, CITIES };
