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
  parameterValuesStr: string,
  newUrl: URL,
) {
  if (operation === 'del') {
    const valuesArr = parameterValuesStr?.split('|');
    valuesArr?.splice(valuesArr.indexOf(parameterValue), 1);
    if (valuesArr.length) {
      parameterValuesStr = valuesArr.join('|');
      newUrl.searchParams.set(parameterName.toLowerCase(), parameterValuesStr);
    } else {
      newUrl.searchParams.delete(parameterName.toLowerCase());
    }
  } else {
    parameterValuesStr = parameterValuesStr
      ? `${parameterValuesStr}|${parameterValue}`
      : parameterValue;
    newUrl.searchParams.set(parameterName.toLowerCase(), parameterValuesStr);
  }
}
