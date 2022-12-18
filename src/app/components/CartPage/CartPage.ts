import { Component } from '../component';
import './CartPage.scss';

export class CartPage extends Component {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'cart-page', 'CART');
  }
}
