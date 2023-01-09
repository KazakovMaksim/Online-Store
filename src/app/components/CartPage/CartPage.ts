import { promoCodes } from '../../constants/promo-codes';
import { CartController } from '../../Helpers/cartController';
import { Pagination } from '../../Helpers/pagination';
import { CartItem } from '../CartItem/cartItem';
import { Component } from '../component';
import { Summary } from '../Summary/summary';
import { Modal } from '../Modal/Modal';
import './CartPage.scss';
import { App } from '../../core/app';

export class CartPage extends Component {
  maxPages = 1;
  emptyMsg: Component | null = null;
  summary: Component | null = null;
  updateCartItemsList: () => void;
  setMaxPages: () => void;
  updateSummary: () => void;
  modal: Modal;

  constructor(parentNode: HTMLElement | null, app: App | undefined) {
    promoCodes.forEach((code) => {
      code.added = false;
    });
    CartController.initCart();
    super(parentNode, 'div', 'cart-page wrapper');
    this.modal = new Modal(this.node, app);

    const cartContainer = new Component(this.node, 'div', 'cart-page-container');
    const summaryContainer = new Component(this.node, 'div', 'summary-container');
    const summary = new Summary(summaryContainer.node);
    this.updateSummary = summary.showNewPrice;
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
    summary.OnBuyNow = () => {
      this.modal.node.classList.add('modal-active');
      app?.main.node.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    };

    this.updateCartItemsList = () => {
      const CartItems = CartController.getCartItems();
      const cartLength = CartItems?.length;
      const limit = Number(Pagination.getLimit());
      const page = Pagination.getPage();
      if (cartLength === 0) {
        summary?.destroy();
        this.emptyMsg?.destroy();
        cartContainer.destroy();
        this.emptyMsg = new Component(
          this.node,
          'span',
          'cart-empty-msg',
          'Your Cart is Empty! Go',
        );
        const linkToProducts = new Component(
          this.emptyMsg.node,
          'a',
          'product-link',
          ' Fill It Now!',
        );
        (linkToProducts.node as HTMLAnchorElement).href = '#products';
        window.scrollTo(0, 0);
      } else if (limit && page) {
        cartItemsList.node.textContent = '';
        CartItems?.forEach((item, index) => {
          if (index + 1 > (page - 1) * limit && index + 1 < page * limit + 1) {
            new CartItem(cartItemsList.node, item.id, this, index + 1);
          }
        });
      }
    };

    const updatePageNumber = (num: number) => {
      Pagination.setPage(num);
      pageNumber.node.textContent = String(num);
      this.updateCartItemsList();
    };

    const currentPage = Pagination.getPage() || 1;
    if (currentPage) updatePageNumber(currentPage);

    this.setMaxPages = () => {
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
      const cartItems = CartController.getCartItems();
      (limitInput.node as HTMLInputElement).value = value ? value?.toString() : '3';
      if (cartItems?.length)
        if (Number(value) > cartItems.length) {
          Pagination.setLimit(cartItems.length);
          (limitInput.node as HTMLInputElement).value = cartItems.length.toString();
          this.setMaxPages();
        }
      if (value) Pagination.setLimit(value);
      else Pagination.setLimit(3);
      this.setMaxPages();
    };

    updateLimit(Number(Pagination.getLimit()));
    this.updateCartItemsList();

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
      this.setMaxPages();
      this.updateCartItemsList();
    });
  }
}
