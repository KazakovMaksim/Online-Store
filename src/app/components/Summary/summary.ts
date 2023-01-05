import { promoCodes } from '../../constants/promo-codes';
import { CartController } from '../../Helpers/cartController';
import { Component } from '../component';
import { PromoCode } from '../PromoCode/promoCode';
import './summary.scss';

export class Summary extends Component {
  checkForCodes: () => void;
  showNewPrice: () => void;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'summary-block');

    new Component(this.node, 'h2', 'summary-header', 'Summary');
    const purchaseDetailsBlock = new Component(this.node, 'div', 'purchase-block');
    const productsQtyLabel = new Component(
      purchaseDetailsBlock.node,
      'p',
      'products-label',
      'Products: ',
    );
    const productsQty = new Component(
      productsQtyLabel.node,
      'span',
      'products-qty',
      CartController.getItemsQty().toString(),
    );

    const totalList = new Component(purchaseDetailsBlock.node, 'div', 'total-list');
    const totalLabel = new Component(totalList.node, 'p', 'total-label', 'Total: ');
    const total = new Component(
      totalLabel.node,
      'span',
      'total-amount',
      `€${CartController.getTotalAmount().toString()}`,
    );

    const newTotalLabel = new Component(totalList.node, 'p', 'new-total-label', 'Total: ');
    const newTotal = new Component(newTotalLabel.node, 'span', 'new-total-amount');

    const promoBlock = new Component(purchaseDetailsBlock.node, 'div', 'promo-container');
    const appliedCodesBlock = new Component(promoBlock.node, 'div', 'applied-codes-container');
    new Component(appliedCodesBlock.node, 'h3', 'applied-codes-header', 'Applied codes');
    const promoInput = new Component(promoBlock.node, 'input', 'input-promo');
    (promoInput.node as HTMLInputElement).type = 'text';
    (promoInput.node as HTMLInputElement).placeholder = 'Enter promo code';
    const foundedPromoBlock = new Component(promoBlock.node, 'div', 'founded-promo');
    new Component(promoBlock.node, 'p', 'test-promo', `Promo for test: 'RS', 'EPM'`);
    const buttonBuyNow = new Component(
      purchaseDetailsBlock.node,
      'button',
      'btn btn-buy-now',
      'BUY NOW',
    );

    this.checkForCodes = () => {
      const input = promoInput.node as HTMLInputElement;
      const foundedCode = promoCodes.find((code) => code.name === input.value.toLowerCase());
      if (foundedCode) {
        foundedPromoBlock.node.textContent = '';
        new PromoCode(
          foundedPromoBlock.node,
          foundedCode.name,
          foundedCode.description,
          foundedCode.discount,
          appliedCodesBlock,
          this,
        );
      } else foundedPromoBlock.node.textContent = '';
    };

    promoInput.node.addEventListener('input', () => {
      this.checkForCodes();
    });

    this.showNewPrice = () => {
      const discounts = promoCodes.filter((code) => code.added);

      total.node.textContent = `€${CartController.getTotalAmount().toString()}`;
      productsQty.node.textContent = CartController.getItemsQty().toString();

      if (discounts.length) {
        totalLabel.node.classList.add('line-through');
        const initialAmount = CartController.getTotalAmount();
        let newAmount = initialAmount;
        discounts.forEach((code) => {
          newAmount = newAmount - initialAmount * (code.discount / 100);
        });
        if (newAmount < 0) newAmount = 0;
        newTotal.node.textContent = `€${newAmount.toFixed(2).toString()}`;
        newTotalLabel.node.classList.add('display-block');
      } else {
        newTotalLabel.node.classList.remove('display-block');
        totalLabel.node.classList.remove('line-through');
        appliedCodesBlock.node.classList.remove('display-flex');
      }
    };
  }
}
