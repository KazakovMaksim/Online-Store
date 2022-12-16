import { Component } from '../component';
import './card.scss';

export class Card extends Component {
  productName = new Component(this.node, 'div', 'product-name');

  productSize = new Component(this.node, 'div', 'product-size');

  productShape = new Component(this.node, 'div', 'product-shape');

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'card');
  }
}
