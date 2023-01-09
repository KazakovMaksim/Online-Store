import { creators } from '../../constants/creators';
import { Component } from '../component';
import './footer.scss';

export class Footer extends Component {
  constructor() {
    super(document.body, 'footer', 'footer wrapper');

    // this function won't be used anywhere else so it's unnecessary to put in the new module
    const addLink = (
      parentNode: HTMLElement,
      href: string,
      className: string,
      content?: string | undefined,
    ) => {
      const link = new Component(parentNode, 'a', className, content);
      (link.node as HTMLAnchorElement).href = href;
      (link.node as HTMLAnchorElement).target = '_blank';
    };

    addLink(this.node, 'https://rs.school/js/', 'rs-logo footer-item');
    new Component(this.node, 'div', 'creation-date footer-item', '2023');

    const creatorsList = new Component(this.node, 'div', 'creators-list footer-item');
    creators.forEach((creator) => {
      addLink(creatorsList.node, creator.gitLink, 'creator-link', creator.nickName);
    });
  }
}
