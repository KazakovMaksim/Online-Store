import { products } from '../../data/products';
import { Component } from '../component';
import './productDetails.scss';

export class ProductDetailsPage extends Component {
  constructor(parentNode: HTMLElement | null, productId?: number) {
    super(parentNode, 'div', 'product-page');
    const selectedProduct = products.products.find((product) => product.id === productId);
    this.node.textContent = String(selectedProduct?.id);
  }
}
