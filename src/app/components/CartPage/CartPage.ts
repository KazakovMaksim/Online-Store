import { CartController } from '../../Helpers/cartController';
import { Pagination } from '../../Helpers/pagination';
import { CartItem } from '../CartItem/cartItem';
import { Component } from '../component';
import './CartPage.scss';

export class CartPage extends Component {
  updateCartItemsList: () => void;
  maxPages = 1;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'cart-page wrapper');

    const cartContainer = new Component(this.node, 'div', 'cart-page-container');
    const summaryContainer = new Component(this.node, 'div', 'summary-container');

    const pagination = new Component(cartContainer.node, 'div', 'pagination-block');
    new Component(pagination.node, 'h2', 'page-header', 'Products in Cart');

    const limitBlock = new Component(pagination.node, 'div', 'limit-container');
    new Component(limitBlock.node, 'span', 'limit-label', 'Limit: ');
    const limitInput = new Component(limitBlock.node, 'input', 'limit-controller');
    (limitInput.node as HTMLInputElement).type = 'number';

    const pageBlock = new Component(pagination.node, 'div', 'page-container');
    new Component(pageBlock.node, 'span', 'page-label', 'Page: ');
    const pageControlsBlock = new Component(pageBlock.node, 'div', 'page-controls');

    const pageDown = new Component(pageControlsBlock.node, 'button', 'btn btn-page-down', '<');
    const pageNumber = new Component(pageControlsBlock.node, 'span', 'page-number', '1');
    const pageUp = new Component(pageControlsBlock.node, 'button', 'btn btn-page-up', '>');

    const cartItemsList = new Component(cartContainer.node, 'div', 'cart-page-items-list');

    // functions & event-handlers
    const setMaxPages = () => {
      const itemsQty = CartController.getCartItems()?.length;
      const limit = Number(Pagination.getLimit());
      if (itemsQty && limit) {
        let division = itemsQty / limit;
        if (!Number.isInteger(division)) division = Math.floor(division) + 1;
        this.maxPages = division;
        const currentPage = Pagination.getPage();
        if (currentPage) if (this.maxPages < currentPage) updatePageNumber(this.maxPages);
      }
    };

    const updateLimit = (value?: number) => {
      (limitInput.node as HTMLInputElement).value = Pagination.getLimit() || '3';
      if (value) Pagination.setLimit(value);
      setMaxPages();
    };

    updateLimit();
    this.updateCartItemsList = () => {
      const CartItems = CartController.getCartItems();
      const cartLength = CartItems?.length;
      const limit = Number(Pagination.getLimit());
      const page = Pagination.getPage();
      if (cartLength === 0) {
        const emptyMsg = new Component(
          cartItemsList.node,
          'span',
          'cart-empty-msg',
          'Your Cart is Empty! Go',
        );
        const linkToProducts = new Component(emptyMsg.node, 'a', 'product-link', ' Fill It Now!');
        (linkToProducts.node as HTMLAnchorElement).href = '#products';
      } else if (limit && page) {
        cartItemsList.node.textContent = '';
        CartItems?.forEach((item, index) => {
          if (index + 1 > (page - 1) * limit && index + 1 < page * limit + 1)
            new CartItem(cartItemsList.node, item.id, this);
        });
      }
    };

    this.updateCartItemsList();

    const updatePageNumber = (num: number) => {
      pageNumber.node.textContent = String(num);
      Pagination.setPage(num);
      this.updateCartItemsList();
    };

    pageDown.node.addEventListener('click', () => {
      const currentNum = Number(pageNumber.node.textContent);
      if (currentNum > 1) {
        const newNum = currentNum - 1;
        updatePageNumber(newNum);
      }
    });

    pageUp.node.addEventListener('click', () => {
      const currentNum = Number(pageNumber.node.textContent);
      if (currentNum < this.maxPages) {
        const newNum = currentNum + 1;
        updatePageNumber(newNum);
      }
    });

    limitInput.node.addEventListener('input', () => {
      const limitInputValue = Number((limitInput.node as HTMLInputElement).value);
      const cartItems = CartController.getCartItems();
      if (limitInputValue < 1) {
        updateLimit(1);
        return;
      }
      if (cartItems)
        if (cartItems?.length < limitInputValue) {
          updateLimit(cartItems?.length);
          return;
        }
      Pagination.setLimit(limitInputValue);
      setMaxPages();
      this.updateCartItemsList();
    });
  }
}
