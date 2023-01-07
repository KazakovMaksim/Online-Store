import { Card } from '../components/Card/card';
import { Product, Selector } from '../types/interface';

export function formCollection(sourceArr: Product[], selector: Selector) {
  const collection: string[] = [];
  sourceArr.forEach((product: Product) => {
    if (collection.indexOf(product[selector]) < 0) {
      collection.push(product[selector]);
    }
  });
  return collection;
}

export function countRange(sourceArr: Product[] | Card[], selector: 'price' | 'stock') {
  const collection = sourceArr.map((product: Product | Card) => product[selector]);
  if (collection.length) {
    collection.sort((a, b) => a - b);
    const min = collection[0];
    const max = Math.max.apply(null, collection);
    return [String(min), String(max)];
  }
  return ['', ''];
}

export function countProductAmount(
  sourceArr: Product[] | Card[],
  selector: Selector,
): Map<string, number> {
  const amountTable = new Map();
  sourceArr.forEach((product: Product | Card) => {
    let val = amountTable.get(product[selector]) ? amountTable.get(product[selector]) : 1;
    if (amountTable.has(product[selector])) {
      val++;
    }
    amountTable.set(product[selector], val);
  });
  return amountTable;
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

export function updateQueryInURL(paramValue: string, paramName: string, paramsListStr: string) {
  const newUrl = new URL(window.location.href);

  if (newUrl.href.indexOf('?') < 0) {
    newUrl.searchParams.set(paramName, paramValue);
  } else {
    changeQueryParameterValues(paramValue, paramName, 'update', paramsListStr, newUrl);
  }
  history.pushState(null, '', newUrl.href);
}
