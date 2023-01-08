import { Component } from '../component';
import './404page.scss';

export class PageNotFound extends Component {
  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'not-found-page');

    new Component(this.node, 'div', 'error-code', '404');
    new Component(this.node, 'div', 'error-message', 'Page not found');

    const header = document.querySelector('.header');
    let screenHeight = window.innerHeight - (header as HTMLElement).offsetHeight;
    this.node.style.height = `${screenHeight}px`;
    window.addEventListener('resize', () => {
      screenHeight = window.innerHeight - (header as HTMLElement).offsetHeight;
      this.node.style.height = `${screenHeight}px`;
    });
  }
}
