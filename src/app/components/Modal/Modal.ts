import { Component } from '../component';
import './Modal.scss';

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
    new Component(formContainer.node, 'h3', 'form-title', 'personal data');
    this.formInfo = new Component(formContainer.node, 'form', 'form-info');

    [this.name, this.phone, this.address, this.mail] = [
      'name',
      'phone number',
      'delivery address',
      'e-mail',
    ].map((elem) => {
      const inputBox = new Component(this.formInfo.node, 'div', 'input-box');
      const input = new Component(inputBox.node, 'input', 'input');
      input.node.setAttribute('placeholder', elem);
      return input;
    });
    this.name.node.setAttribute(
      'title',
      'field must have at least two words with min length 3 letters',
    );
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
    });

    logo.node.setAttribute('src', '../../../assets/img/maestro.png');

    const cardValidity = new Component(fieldset.node, 'div', 'card-validity');
    const cardInputs = new Component(cardValidity.node, 'div', 'card-inputs');
    ['Expire', 'Cvc'].forEach((elem) => {
      const label = new Component(cardInputs.node, 'label', 'card-label', elem);
      label.node.setAttribute('for', elem);
      const input = new Component(cardInputs.node, 'input');
      const max = elem === 'Cvc' ? '3' : '5';
      input.node.setAttribute('maxlength', max);
      input.node.setAttribute('id', elem);
      if (elem === 'Expire') this.expire = input;

      input.node.oninput = () => {
        (input.node as HTMLInputElement).value = (input.node as HTMLInputElement).value.replace(
          /[^\d]/g,
          '',
        );
      };
      (this.expire?.node as HTMLInputElement).oninput = () => {
        (this.expire?.node as HTMLInputElement).value = (
          this.expire?.node as HTMLInputElement
        ).value.replace(/[^[/]\d]/g, '');
        if ((this.expire?.node as HTMLInputElement).value.length === 2) {
          (this.expire?.node as HTMLInputElement).value =
            (this.expire?.node as HTMLInputElement).value + '/';
        }
      };
    });
    const confirmBtn = new Component(formContainer.node, 'button', 'form-btn', 'confirm');

    confirmBtn.node.onclick = () => {
      const nameVal = (this.name.node as HTMLInputElement).value;
      console.log('checkNameInp=', this.checkNameOrAddressInp(nameVal, 'name'));
      const addressVal = (this.address.node as HTMLInputElement).value;
      console.log('checkAddressInp=', this.checkNameOrAddressInp(addressVal, 'address'));

      this.node.classList.remove('modal-active');
      (this.formInfo.node as HTMLFormElement).reset();
    };
    this.node.onclick = (e) => {
      if (e.target === this.node) this.node.classList.remove('modal-active');
    };
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
