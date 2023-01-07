import { Component } from '../components/component';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { HomePage } from '../components/HomePage/HomePage';
import { CartPage } from '../components/CartPage/CartPage';
import { ProductsPage } from '../components/ProductsPage/ProductsPage';
import { routing, defaultRoute } from './router';
import { ProductDetailsPage } from '../components/ProductDetailsPage/productDetails';
import { CartController } from '../Helpers/cartController';
import { PageNotFound } from '../components/404page/404page';

export class App {
  main = new Component(null, 'main', 'main');

  mainContent: null | CartPage | HomePage | ProductsPage = null;

  enableRouteChange = (): void => {
    window.onpopstate = () => {
      const hash = window.location.hash;
      const currentRouteName = hash.slice(
        1,
        hash.indexOf('/') === -1 ? undefined : hash.indexOf('/'),
      );
      const currentRoute = routing.find((p) => p.name === currentRouteName);
      this.mainContent?.node.remove();

      if (!document.body.children.length) {
        const header = new Header();
        CartController.updateCartQty = header.updateCartQty;
        CartController.updateTotalAmount = header.updateTotalAmount;
        document.body.append(header.node, this.main.node, new Footer().node);
        CartController.setCartQty();
        CartController.setTotalAmount();
      }

      if (currentRouteName === 'products') {
        this.mainContent = currentRoute?.component() as ProductsPage;
      }
      if (currentRouteName === 'cart') {
        this.mainContent = currentRoute?.component() as CartPage;
      }
      if (currentRouteName === 'product-details') {
        const productId = Number(hash.slice(hash.indexOf('/') + 1));
        this.mainContent = currentRoute?.component(productId) as ProductDetailsPage;
      }

      if (currentRoute && this.mainContent) {
        this.main.node.append(this.mainContent.node);
      } else {
        this.mainContent = defaultRoute.component() as PageNotFound;
        this.main.node.append(this.mainContent.node);
      }
    };

    const popstateEvent = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  };
}
