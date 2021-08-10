import dayjs from 'dayjs';

import { getRandomInteger } from '../utils';

import { CITIES, TYPES } from '../const';

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

let previousPointEndDate = new Date();
const generateDates = () => {
  const startDayGap = getRandomInteger(0, 30) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
  const endDayGap = getRandomInteger(0, 10) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
  // debugger;
  const dateFrom = dayjs(previousPointEndDate).add(startDayGap, 'minute').toDate();
  const dateTo = dayjs(dateFrom).add(endDayGap, 'minute').toDate();
  previousPointEndDate = dateTo;
  return {
    from: dateFrom,
    to: dateTo,
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

const offersTitles = ['Choose meal', 'Choose seat', 'Upgrade to comfort', 'Add luggage', 'Add massage', 'Unlimited alcohol', 'WiFi'];

const generateOffers = () => {
  const generateOffer = (offerName) => ({
    title: offerName,
    price: getRandomInteger(0, 1000),
  });

  const getOffersArr = () => {
    const offersCount = getRandomInteger(2, 5);
    const startIndex = getRandomInteger(0, offersTitles.length - offersCount);
    const endIndex = startIndex + offersCount;

    return offersTitles.slice(startIndex, endIndex).map((item) => generateOffer(item));
  };

  return TYPES.map((type) => ({
    type,
    offers: getOffersArr(),
  }));
};

const offersByType = generateOffers();
// console.log(offersByType);

const generateItemOffers = (currentType) => {
  const availabelOffers = offersByType.find(({ type }) => type === currentType).offers;
  const offersCount = getRandomInteger(1, availabelOffers.length);
  const startIndex = getRandomInteger(0, availabelOffers.length - offersCount);
  const endIndex = startIndex + offersCount;
  // const offers = new Array(offersNumber).fill().map(() => generateRandomItem(availabelOffers));
  const offers = availabelOffers.slice(startIndex, endIndex);
  return offers;
};

const generateTripItem = (index = 0) => {
  // const isDestination = Boolean(getRandomInteger(0, 1));
  const isDestination = true;
  const areOffers = Boolean(getRandomInteger(0, 1));
  const type = generateRandomItem(TYPES);
  const dates = generateDates();

  return {
    type,
    dateFrom: dates.from,
    dateTo: dates.to,
    id: index,
    basePrice: getRandomInteger(0, 5000),
    offers: areOffers ? generateItemOffers(type) : [],
    destination: isDestination ? generateDestination() : undefined,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export { generateTripItem, offersByType };
