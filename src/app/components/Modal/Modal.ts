import { Component } from '../component';
import { tittles, personalData, cardData, imgSrc, confirmText } from '../../constants/modal';
import './Modal.scss';
import { CartController } from '../../Helpers/cartController';

export class Modal extends Component {
  formInfo: Component;
  expire: Component | null = null;
  name: Component;
  phone: Component;
  address: Component;
  mail: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'modal');

    const formContainer = new Component(this.node, 'div', 'form-container');
    const overlay = new Component(this.node, 'div', 'overlay');
    overlay.node.append(new Component(overlay.node, 'p', 'overlay-congrat', confirmText).node);

    new Component(formContainer.node, 'h3', 'form-title', 'personal data');
    this.formInfo = new Component(formContainer.node, 'form', 'form-info');

    [this.name, this.phone, this.address, this.mail] = personalData.map((elem) => {
      const inputBox = new Component(this.formInfo.node, 'div', 'input-box');
      const input = new Component(inputBox.node, 'input', 'input');
      input.node.setAttribute('placeholder', elem);
      return input;
    });

    this.name.node.setAttribute('title', tittles.name);
    this.address.node.setAttribute('title', tittles.address);
    this.phone.node.setAttribute('title', tittles.phone);
    this.mail.node.setAttribute('title', tittles.mail);

    this.phone.node.oninput = () => {
      this.restrictPhoneNumberInput();
    };

    new Component(formContainer.node, 'h3', 'form-title', 'credit card details');

    const cardContainer = new Component(formContainer.node, 'div', 'card-container');
    const cardHeading = new Component(cardContainer.node, 'div', 'card-heading');
    new Component(cardHeading.node, 'div', 'card-bank', 'Sberbank');
    const logo = new Component(cardHeading.node, 'img', 'card-logo');

    const fieldset = new Component(cardContainer.node, 'fieldset', 'card-fieldset');
    const cardNumber = new Component(fieldset.node, 'div', 'card-number');
    const labelNum = new Component(cardNumber.node, 'label', 'card-label', 'card number');
    labelNum.node.setAttribute('for', 'number1');
    const inputs = new Component(cardNumber.node, 'div', 'card-inputs');
    [...new Array(4)].forEach((elem, i) => {
      const input = new Component(inputs.node, 'input', 'card-input');
      input.node.setAttribute('maxlength', '4');
      input.node.setAttribute('id', `number${i + 1}`);
      input.node.oninput = () => {
        (input.node as HTMLInputElement).value = (input.node as HTMLInputElement).value.replace(
          /[^\d]/g,
          '',
        );
      };
      if (i === 0) {
        input.node.addEventListener('input', () => {
          const curValue = (input.node as HTMLInputElement).value;
          if (+curValue[0] > 3 && +curValue[0] < 7) {
            const newSrc = imgSrc[+curValue[0] - 3];
            logo.node.setAttribute('src', newSrc);
          } else if (+curValue[0] <= 3 || +curValue[0] >= 7 || curValue.length === 0) {
            logo.node.setAttribute('src', imgSrc[0]);
          }
        });
      }
    });

    logo.node.setAttribute('src', imgSrc[0]);

    const cardValidity = new Component(fieldset.node, 'div', 'card-validity');
    const cardInputs = new Component(cardValidity.node, 'div', 'card-inputs');
    cardData.forEach((elem) => {
      const label = new Component(cardInputs.node, 'label', 'card-label', elem);
      label.node.setAttribute('for', elem);
      const input = new Component(cardInputs.node, 'input');
      const max = elem === 'Cvc' ? '3' : '5';
      input.node.setAttribute('maxlength', max);
      input.node.setAttribute('id', elem);
      if (elem === 'Expire') this.expire = input;

      input.node.oninput = () => {
        const expire = input.node as HTMLInputElement;
        expire.value = expire.value.replace(/[^\d]/g, '');
      };
    });
    const confirmBtn = new Component(formContainer.node, 'button', 'form-btn', 'confirm');

    confirmBtn.node.onclick = () => {
      const nameVal = (this.name.node as HTMLInputElement).value;
      console.log('checkNameInp=', this.checkNameOrAddressInp(nameVal, 'name'));
      const addressVal = (this.address.node as HTMLInputElement).value;
      console.log('checkAddressInp=', this.checkNameOrAddressInp(addressVal, 'address'));

      (this.formInfo.node as HTMLFormElement).reset();

      const items = CartController.getCartItems();
      items?.forEach((elem) => {
        CartController.remove(elem.id);
      });

      overlay.node.classList.add('overlay_active');

      setTimeout(() => {
        this.node.classList.remove('modal-active');
        window.location.hash = 'products';
      }, 3000);
    };

    this.node.onclick = (e) => {
      if (e.target === this.node) this.node.classList.remove('modal-active');
    };
  }

  restrictPhoneNumberInput() {
    const curValue = (this.phone.node as HTMLInputElement).value;
    const prevValue = curValue.slice(0, curValue.length - 1);
    const last = curValue.slice(curValue.length - 1);

    if (curValue.length === 1 && curValue !== '+') {
      (this.phone.node as HTMLInputElement).value = curValue.replace(/./g, '');
    } else if (curValue.length >= 2 && curValue.length <= 10 && !/\d/.test(last)) {
      (this.phone.node as HTMLInputElement).value = prevValue;
    } else if (curValue.length > 10) {
      (this.phone.node as HTMLInputElement).value = prevValue;
    }
  }

  checkWordsNum(str: string, minWordsNum: number) {
    return str.trim().split(' ').length >= minWordsNum;
  }

  checkWordsValidity(str: string, minWordLength: number) {
    const words = str.trim().split(' ');
    const regExp = minWordLength === 5 ? /^\w{5}/ : /^\w{3}/;
    const validWords = words.filter((word) => regExp.test(word));
    return words.length === validWords.length;
  }

  checkNameOrAddressInp(inputStr: string, goal: string) {
    const [numLimit, lengthLimit] = goal === 'name' ? [2, 3] : [3, 5];
    if (
      !this.checkWordsNum(inputStr, numLimit) ||
      !this.checkWordsValidity(inputStr, lengthLimit)
    ) {
      return false;
    }
    return true;
  }

  checkNumberValidity(str: string, minWordLength: number) {
    const words = str.trim().split(' ');
    const regExp = minWordLength === 5 ? /^\w{5}/ : /^\w{3}/;
    const validWords = words.filter((word) => regExp.test(word));
    return words.length === validWords.length;
  }
}
