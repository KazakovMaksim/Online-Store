import { Footer } from '../components/Footer/footer';
import { Header } from '../components/Header/header';
import { routing, defaultRoute } from './router';

export class App {
  enableRouteChange = (): void => {
    window.onpopstate = () => {
      const currentRouteName = window.location.hash.slice(1);
      const currentRoute = routing.find((p) => p.name === currentRouteName);

      if (!document.body.children.length) {
        document.body.append(new Header().node, new Footer().node);
      } else if (defaultRoute) {
        console.log('defaultRoute');
      }

      if (currentRoute) {
        // game = currentRoute.component();
        // main = game.node;
      } else {
        // main = defaultRoute.component();
        document.body.lastElementChild?.before(defaultRoute.component().node);
      }

      if (currentRouteName === 'products') {
        console.log('PRODUCTS');
      }
      if (currentRouteName === 'cart') {
        console.log('CART');
      }
    };

    const popstateEvent = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  };
}
