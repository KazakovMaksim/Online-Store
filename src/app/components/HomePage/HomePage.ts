import { Component } from '../component';
import './HomePage.scss';

export class HomePage extends Component {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'home-page', 'HOME');
  }
}
