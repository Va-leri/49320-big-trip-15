export const tripPrice = (tripPoints) => {
  const totalPrice = tripPoints.reduce((price, { basePrice }) => price + basePrice, 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>`;
};
