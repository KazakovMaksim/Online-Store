import { ProductItem, Selector } from '../../types/interface';

export function formCollection(sourceArr: ProductItem[], selector: Selector) {
  const collection: string[] = [];
  sourceArr.forEach((product: ProductItem) => {
    if (collection.indexOf(product[selector]) < 0) {
      collection.push(product[selector]);
    }
  });
  return collection;
}

export function countRange(sourceArr: ProductItem[], selector: 'price' | 'stock') {
  const collection = sourceArr
    .map((product: ProductItem) => product[selector])
    .sort((a, b) => a - b);
  const min = collection[0];
  const max = Math.max.apply(null, collection);
  return [min, max];
}

export function changeQueryParameterValues(
  parameterValue: string,
  parameterName: string,
  operation: string,
  parameterValues: string[],
  newUrl: URL,
) {
  if (operation === 'del') {
    const categoryArr = parameterValues[0]?.split('|');
    categoryArr?.splice(categoryArr.indexOf(parameterValue.toLowerCase()), 1);
    if (categoryArr.length) {
      parameterValues[0] = categoryArr.join('|');
      newUrl.searchParams.set(parameterName.toLowerCase(), parameterValues[0]);
    } else {
      newUrl.searchParams.delete(parameterName.toLowerCase());
    }
  } else {
    parameterValues[0] = parameterValues[0]
      ? `${parameterValues[0]}|${parameterValue}`
      : parameterValue;
    newUrl.searchParams.set(parameterName.toLowerCase(), parameterValues[0]);
  }
}
