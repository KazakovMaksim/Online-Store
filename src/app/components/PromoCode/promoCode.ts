import { promoCodes } from '../../constants/promo-codes';
import { Component } from '../component';
import { Summary } from '../Summary/summary';

type buttonTypes = 'ADD' | 'DROP';

export class PromoCode extends Component {
  constructor(
    parentNode: HTMLElement | null,
    name: string,
    description: string,
    discount: number,
    blockIn: Component,
    invokeComponent: Summary,
    type: buttonTypes = 'ADD',
  ) {
    super(parentNode, 'div', `promo-code`);

    new Component(this.node, 'p', 'promo-desc', `${description} - ${discount}%`);
    let button;
    const currentCode = promoCodes.find((code) => code.name === name.toLowerCase());
    if (!currentCode) return;
    if (type === 'ADD') {
      if (currentCode?.added) return;
      button = new Component(this.node, 'button', 'btn promo-desc', 'ADD');
      button.node.addEventListener('click', () => {
        currentCode.added = true;
        console.log(promoCodes.find((code) => code.name === name.toLowerCase()));
        this.destroy();
        blockIn.node.classList.add('display-flex');
        new PromoCode(blockIn.node, name, description, discount, blockIn, invokeComponent, 'DROP');
        invokeComponent.checkForCodes();
        invokeComponent.showNewPrice();
      });
    } else {
      button = new Component(this.node, 'button', 'btn promo-desc', 'DROP');
      button.node.addEventListener('click', () => {
        currentCode.added = false;
        this.destroy();
        invokeComponent.checkForCodes();
        invokeComponent.showNewPrice();
      });
    }
  }
}
