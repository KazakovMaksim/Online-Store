import { Href } from '../constants/router-refs';
import { IRoute } from '../types/interface';
import { CartPage } from '../components/CartPage/CartPage';
import { ProductsPage } from '../components/ProductsPage/ProductsPage';
import { ProductDetailsPage } from '../components/ProductDetailsPage/productDetails';
import { PageNotFound } from '../components/404page/404page';

export const routing: IRoute[] = [
  {
    name: Href.CART,
    component: (): CartPage => new CartPage(null),
  },
  {
    name: Href.PRODUCTS,
    component: (): ProductsPage => new ProductsPage(null),
  },
  {
    name: Href.PRODUCT_DETAILS,
    component: (productId?: number): ProductDetailsPage => new ProductDetailsPage(null, productId),
  },
];

export const defaultRoute: IRoute = {
  name: Href.NOTFOUND,
  component: () => new PageNotFound(null),
};
