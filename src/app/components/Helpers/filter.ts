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

// if (this.categoryList.indexOf(product.category) < 0) {
//   this.categoryList.push(product.category);
// }
