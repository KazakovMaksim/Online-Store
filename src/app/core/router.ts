import { Href } from '../constants/router-refs';
import { IRoute } from '../types/interface';
import { CartPage } from '../components/CartPage/CartPage';
import { ProductsPage } from '../components/ProductsPage/ProductsPage';
import { ProductDetailsPage } from '../components/ProductDetailsPage/productDetails';
import { PageNotFound } from '../components/404page/404page';
import { App } from './app';

export const routing: IRoute[] = [
  {
    name: Href.CART,
    component: (id, app: App | undefined): CartPage => new CartPage(null, app),
  },
  {
    name: Href.PRODUCTS,
    component: (): ProductsPage => new ProductsPage(null),
  },
  {
    name: Href.PRODUCT_DETAILS,
    component: (productId?: number, app?: App | undefined): ProductDetailsPage =>
      new ProductDetailsPage(null, productId, app),
  },
];

export const defaultRoute: IRoute = {
  name: Href.NOTFOUND,
  component: () => new PageNotFound(null),
};
