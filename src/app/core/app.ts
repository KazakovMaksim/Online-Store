import { Component } from '../components/component';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { HomePage } from '../components/HomePage/HomePage';
import { CartPage } from '../components/CartPage/CartPage';
import { ProductsPage } from '../components/ProductsPage/ProductsPage';
import { routing, defaultRoute } from './router';

export class App {
  main = new Component(null, 'main', 'main');

  mainContent: null | CartPage | HomePage | ProductsPage = null;

  enableRouteChange = (): void => {
    window.onpopstate = () => {
      const currentRouteName = window.location.hash.slice(1);
      const currentRoute = routing.find((p) => p.name === currentRouteName);
      this.mainContent?.node.remove();

      if (!document.body.children.length) {
        document.body.append(new Header().node, this.main.node, new Footer().node);
      }

      if (currentRouteName === 'products') {
        this.mainContent = currentRoute?.component() as ProductsPage;
      }
      if (currentRouteName === 'cart') {
        this.mainContent = currentRoute?.component() as CartPage;
      }

      if (currentRoute && this.mainContent) {
        this.main.node.append(this.mainContent.node);
      } else {
        this.mainContent = defaultRoute.component() as HomePage;
        this.main.node.append(this.mainContent.node);
      }
    };

    const popstateEvent = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  };
}
