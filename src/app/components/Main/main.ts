import { Component } from '../component';
import { Card } from '../Card/card';
import { products } from '../../data/products';
import './main.scss';

export class MainPage extends Component {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'main', 'main', 'MAIN');

    products.forEach((el, i) => {
      const card = new Card(null);
      card.productName.node.innerText = el.name;
      card.productSize.node.innerText = el.size;
      card.productShape.node.innerText = el.shape;
      this.node.append(card.node);
    });
  }
}
