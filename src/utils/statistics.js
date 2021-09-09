export const getItemsByType = (type, items) => items.filter((item) => type === item.type);

export const sortValues = (types, values) => {
  const valuesByType = types.map((type, i) => ({ type, value: values[i] }));

  valuesByType.sort((a, b) => b.value - a.value);

  const typesFiltered = [];
  const valuesFiltered = [];

  valuesByType.forEach((item) => {
    typesFiltered.push(item.type);
    valuesFiltered.push(item.value);
  });

  return ({ typesFiltered, valuesFiltered });
};
