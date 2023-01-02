import { CartController } from '../../Helpers/cartController';
import { CartItem } from '../CartItem/cartItem';
import { Component } from '../component';
import './CartPage.scss';

export class CartPage extends Component {
  updateCartItemsList: () => void;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'cart-page wrapper');

    const cartContainer = new Component(this.node, 'div', 'cart-page-container');
    const summaryContainer = new Component(this.node, 'div', 'summary-container');

    new Component(cartContainer.node, 'h2', 'page-header', 'Products in Cart');

    const cartItemsList = new Component(cartContainer.node, 'div', 'cart-page-items-list');

    this.updateCartItemsList = () => {
      const CartItems = CartController.getCartItems();
      if (CartItems?.length === 0) {
        const emptyMsg = new Component(
          cartItemsList.node,
          'span',
          'cart-empty-msg',
          'Your Cart is Empty! Go',
        );
        const linkToProducts = new Component(emptyMsg.node, 'a', 'product-link', ' Fill It Now!');
        (linkToProducts.node as HTMLAnchorElement).href = '#products';
      } else {
        cartItemsList.node.textContent = '';
        CartItems?.forEach((item) => {
          new CartItem(cartItemsList.node, item.id, this);
        });
      }
    };

    this.updateCartItemsList();
  }
}
