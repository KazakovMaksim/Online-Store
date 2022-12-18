import { Component } from '../component';
import './header.scss';

export class Header extends Component {
  constructor() {
    super(document.body, 'header', 'header', 'HEADER');
  }
}
