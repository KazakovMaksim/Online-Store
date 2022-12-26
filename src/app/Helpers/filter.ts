import { Card } from '../components/Card/card';
import { ProductItem, Selector } from '../types/interface';

export function formCollection(sourceArr: ProductItem[], selector: Selector) {
  const collection: string[] = [];
  sourceArr.forEach((product: ProductItem) => {
    if (collection.indexOf(product[selector]) < 0) {
      collection.push(product[selector]);
    }
  });
  return collection;
}

export function countRange(sourceArr: ProductItem[] | Card[], selector: 'price' | 'stock') {
  const collection = sourceArr
    .map((product: ProductItem | Card) => product[selector])
    .sort((a, b) => a - b);
  const min = collection[0];
  const max = Math.max.apply(null, collection);
  return [String(min), String(max)];
}

export function changeQueryParameterValues(
  paramValue: string,
  paramName: string,
  operation: string,
  paramValuesStr: string,
  newUrl: URL,
) {
  if (operation === 'del') {
    const valuesArr = paramValuesStr?.split('↕');
    valuesArr?.splice(valuesArr.indexOf(paramValue), 1);
    if (valuesArr.length) {
      paramValuesStr = valuesArr.join('↕');
      newUrl.searchParams.set(paramName.toLowerCase(), paramValuesStr);
    } else {
      newUrl.searchParams.delete(paramName.toLowerCase());
    }
  } else if (operation === 'add') {
    paramValuesStr = paramValuesStr ? `${paramValuesStr}↕${paramValue}` : paramValue;
    newUrl.searchParams.set(paramName.toLowerCase(), paramValuesStr);
  } else {
    paramValuesStr = paramValue;
    newUrl.searchParams.set(paramName.toLowerCase(), paramValuesStr);
  }
}
