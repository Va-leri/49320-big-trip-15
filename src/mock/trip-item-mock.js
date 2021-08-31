import dayjs from 'dayjs';

import { getRandomInteger } from '../utils/common.js';

import { CITIES, TYPES, TRIP_ITEMS_COUNT } from '../const.js';

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

const generateDates = (previousPointEndDate) => {
  const startDayGap = getRandomInteger(0, 30) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
  const endDayGap = getRandomInteger(0, 10) * 24 * 60 + getRandomInteger(0, 23) * 60 + getRandomInteger(0, 59);
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

const generateDestination = (city) => ({
  description: generateDescription(),
  name: city,
  pictures: generatePictures(),
});

const generateDestinations = () => CITIES.map((city) => generateDestination(city));

const destinations = generateDestinations();

const offersTitles = ['Choose meal', 'Choose seat', 'Upgrade to comfort', 'Add luggage', 'Add massage', 'Unlimited alcohol', 'WiFi'];

const generateOffers = () => {
  const generateOffer = (offerName) => ({
    title: offerName,
    price: getRandomInteger(0, 1000),
  });

  const getOffersArr = () => {
    const offersCount = getRandomInteger(0, 5);
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

const generateItemOffers = (currentType) => {
  const availabelOffers = offersByType.find(({ type }) => type === currentType).offers;
  const offersCount = getRandomInteger(1, availabelOffers.length);
  const startIndex = getRandomInteger(0, availabelOffers.length - offersCount);
  const endIndex = startIndex + offersCount;
  const offers = availabelOffers.slice(startIndex, endIndex);
  return offers;
};

const generateTripItem = (index = 0, previousPointEndDate) => {
  const isDestination = Boolean(getRandomInteger(0, 1));
  // const isDestination = true;
  const areOffers = Boolean(getRandomInteger(0, 1));
  const type = generateRandomItem(TYPES);
  const dates = generateDates(previousPointEndDate);

  return {
    type,
    dateFrom: dates.from,
    dateTo: dates.to,
    id: index,
    basePrice: getRandomInteger(0, 5000),
    offers: areOffers ? generateItemOffers(type) : [],
    destination: isDestination ? destinations[getRandomInteger(0, destinations.length - 1)] : undefined,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

const generateTripItems = (tripItemsCount) => {
  const items = [];
  let previousPointEndDate = new Date();
  for (let i = 0; i < tripItemsCount; i++) {
    const item = generateTripItem(i, previousPointEndDate);
    previousPointEndDate = item.dateTo;
    items.push(item);
  }

  return items;
};

const tripItems = generateTripItems(TRIP_ITEMS_COUNT);

export { tripItems, offersByType, destinations };
