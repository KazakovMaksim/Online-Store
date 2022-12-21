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
