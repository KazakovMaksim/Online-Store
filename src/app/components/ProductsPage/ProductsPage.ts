import { Component } from '../component';
import { Card } from '../Card/card';
import { products } from '../../data/products';
import './ProductsPage.scss';

export class ProductsPage extends Component {
  controlsContainer = new Component(this.node, 'div', 'controls-container');

  productsContainer = new Component(this.node, 'div', 'products-container');

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'products-page');

    products.forEach((el) => {
      const card = new Card(null);
      card.productName.innerText = el.name;
      card.productSize.node.innerText = el.size;
      card.productShape.node.innerText = el.shape;
      this.productsContainer.node.append(card.node);
    });
  }
}
