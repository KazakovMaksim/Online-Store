import { products } from '../../data/products';
import { CartController } from '../../Helpers/cartController';
import { CartPage } from '../CartPage/CartPage';
import { Component } from '../component';
import './cartItem.scss';

export class CartItem extends Component {
  cartPage: CartPage;

  constructor(parentNode: HTMLElement | null, productId: number, cartPage: CartPage) {
    super(parentNode, 'div', 'cart-page-item');
    this.cartPage = cartPage;
    const product = products.products.find((product) => product.id === productId);

    if (product) {
      // image
      const imgBlock = new Component(this.node, 'div', 'img-block');
      imgBlock.node.style.backgroundImage = `url(${product?.thumbnail})`;

      imgBlock.node.addEventListener('click', () => {
        window.location.hash = `product-details/${productId}`;
      });

      // description
      const descriptionBlock = new Component(this.node, 'div', 'description-block');
      new Component(descriptionBlock.node, 'h3', 'product-name', product?.title);
      new Component(descriptionBlock.node, 'p', 'product-brand', `Brand: ${product?.brand}`);
      new Component(
        descriptionBlock.node,
        'p',
        'product-desc',
        `Description: ${product?.description}`,
      );
      new Component(descriptionBlock.node, 'p', 'product-rating', `Rating: ${product?.rating}`);
      new Component(
        descriptionBlock.node,
        'p',
        'product-discount',
        `Discount: ${product?.discount}%`,
      );
      new Component(
        descriptionBlock.node,
        'p',
        'product-category',
        `Category: ${product?.category}`,
      );

      // qty controls
      const qtyControlsBlock = new Component(this.node, 'div', 'qty-controls');
      new Component(qtyControlsBlock.node, 'p', 'product-stock', `Stock: ${product?.stock}`);
      const qtyButtons = new Component(qtyControlsBlock.node, 'div', 'qty-buttons');
      const btnUp = new Component(qtyButtons.node, 'button', 'btn btn-round btn-qty-up', '+');
      const qty = new Component(
        qtyButtons.node,
        'div',
        'item-qty',
        `${CartController.getItemQty(productId) || 1}`,
      );
      const btnDown = new Component(qtyButtons.node, 'button', 'btn-round btn btn-qty-down', '-');
      const priceBlock = new Component(
        qtyControlsBlock.node,
        'span',
        'product-price',
        `€${product?.price * (CartController.getItemQty(productId) || 1)}`,
      );

      const updateItem = (newQty: number) => {
        qty.node.textContent = String(newQty);
        priceBlock.node.textContent = `€${product.price * newQty}`;
      };

      btnUp.node.addEventListener('click', () => {
        // here is Infinity in order to shut up TypeScript, here could be any other value
        const itemQty = CartController.getItemQty(productId) || Infinity;
        if (itemQty < product.stock) {
          CartController.add(productId);
          updateItem(itemQty + 1);
        }
      });

      const dropFromCart = () => {
        CartController.remove(productId);
        this.destroy();
        this.cartPage.setMaxPages();
        this.cartPage.updateCartItemsList();
      };

      btnDown.node.addEventListener('click', () => {
        const itemQty = CartController.getItemQty(productId) || Infinity;
        if (itemQty === 1) {
          dropFromCart();
        } else {
          CartController.decreaseItemQty(productId);
          updateItem(itemQty - 1);
        }
      });

      // remove button
      const dropBtn = new Component(this.node, 'p', 'drop-from-cart', 'Drop');
      dropBtn.node.addEventListener('click', dropFromCart);
    }
  }
}
