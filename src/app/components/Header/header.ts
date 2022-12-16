import { Component } from '../component';
import './header.scss';

export class Header extends Component {
  constructor() {
    super(document.body, 'header', 'header');
    this.node.innerHTML = `
    <header>
      <div class="wrapper header-inner">
        <a href="#">
          <div class="logo">
            <!-- <img src="#" alt="logotype here if nedeed"> -->
            <h1>Online Store</h1>
          </div>
        </a>

        <div class="cart-container">
          <p class="cart-total-container">
            Cart total: <span>€<span class="total-amount">00,00</span></span>
          </p>
          <div class="cart">
            <div class="cart-quantity">0</div>
          </div>
        </div>
      </div>
    </header>`;
  }
}
