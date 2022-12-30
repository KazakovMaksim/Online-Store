import { Component } from '../component';
import './header.scss';

export class Header extends Component {
  totalAmount: Component;
  cartQty: Component;

  updateCartQty: (qty: number) => void;
  updateTotalAmount: (amount: number) => void;

  constructor() {
    super(document.body, 'header', 'header');
    const innerHeader = new Component(this.node, 'div', 'wrapper header-inner');
    const logoLink = new Component(innerHeader.node, 'a', 'logo-link');
    (logoLink.node as HTMLAnchorElement).href = '#';
    const logoContainer = new Component(logoLink.node, 'div', 'logo');
    new Component(logoContainer.node, 'h1', undefined, 'Online Store');

    const cartContainer = new Component(innerHeader.node, 'div', 'cart-container');
    const cartTotalContainer = new Component(
      cartContainer.node,
      'p',
      'cart-total-container',
      'Cart total: ',
    );
    this.totalAmount = new Component(
      new Component(cartTotalContainer.node, 'span', undefined, '€').node,
      'span',
      'total-amount',
      '0',
    );

    this.cartQty = new Component(
      new Component(cartContainer.node, 'div', 'cart').node,
      'div',
      'cart-quantity',
      '0',
    );

    this.updateCartQty = (qty: number) => {
      this.cartQty.node.textContent = qty.toString();
    };

    this.updateTotalAmount = (amount: number) => {
      this.totalAmount.node.textContent = amount.toString();
    };
  }
}
