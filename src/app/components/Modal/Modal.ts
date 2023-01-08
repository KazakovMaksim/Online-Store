import { Component } from '../component';
import {
  tittles,
  userDataFields,
  cardDataFields,
  imgSrc,
  confirmText,
} from '../../constants/modal';
import './Modal.scss';
import { CartController } from '../../Helpers/cartController';

export class Modal extends Component {
  formInfo: Component;
  expire: Component | null = null;
  errFields: Map<string, Component> = new Map();
  userData: Component[] = [];
  cardData: Component[] = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'modal');

    const formContainer = new Component(this.node, 'div', 'form-container');
    const overlay = new Component(this.node, 'div', 'overlay');
    overlay.node.append(new Component(overlay.node, 'p', 'overlay-congrat', confirmText).node);

    new Component(formContainer.node, 'h3', 'form-title', 'personal data');
    this.formInfo = new Component(formContainer.node, 'form', 'form-info');

    userDataFields.map((elem, i) => {
      const inputBox = new Component(this.formInfo.node, 'div', 'input-box');
      const input = new Component(inputBox.node, 'input', 'input');
      const errField = new Component(inputBox.node, 'span', 'error', `error in ${elem}`);

      this.userData.push(input);
      this.errFields.set(elem, errField);
      input.node.setAttribute('placeholder', elem);
      input.node.setAttribute('title', tittles[i]);
      return input;
    });

    const phone = this.userData[1];
    phone.node.oninput = () => {
      this.restrictPhoneNumberInput(phone);
    };

    new Component(formContainer.node, 'h3', 'form-title', 'credit card details');

    const cardContainer = new Component(formContainer.node, 'div', 'card-container');
    const cardHeading = new Component(cardContainer.node, 'div', 'card-heading');
    new Component(cardHeading.node, 'div', 'card-bank', 'Sberbank');
    const logo = new Component(cardHeading.node, 'img', 'card-logo');
    logo.node.setAttribute('src', imgSrc[0]);

    const fieldset = new Component(cardContainer.node, 'fieldset', 'card-fieldset');
    const cardNumber = new Component(fieldset.node, 'div', 'card-number');
    const labelNum = new Component(cardNumber.node, 'label', 'card-label', 'card number');
    const errSpan = new Component(cardNumber.node, 'span', 'card-error', `card number error`);
    this.errFields.set('card number', errSpan);
    labelNum.node.setAttribute('for', 'number1');
    const inputs = new Component(cardNumber.node, 'div', 'card-inputs');

    [...new Array(4)].forEach((elem, i) => {
      const input = new Component(inputs.node, 'input', 'card-input');
      input.node.setAttribute('maxlength', '4');
      input.node.setAttribute('id', `number${i + 1}`);
      this.cardData.push(input);

      input.node.oninput = () => {
        const node = input.node as HTMLInputElement;
        node.value = node.value.replace(/[^\d]/g, '');
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

    const cardValidity = new Component(fieldset.node, 'div', 'card-validity');
    const cardInputs = new Component(cardValidity.node, 'div', 'card-inputs');
    cardDataFields.forEach((elem) => {
      const errSpan = new Component(cardInputs.node, 'span', 'card-error', `${elem} error`);
      this.errFields.set(elem, errSpan);
      const label = new Component(cardInputs.node, 'label', 'card-label', elem);
      label.node.setAttribute('for', elem);
      const input = new Component(cardInputs.node, 'input');
      this.cardData.push(input);
      const max = elem === 'cvc' ? '3' : '5';
      input.node.setAttribute('maxlength', max);
      input.node.setAttribute('id', elem);
      if (elem === 'Expire') this.expire = input;

      input.node.oninput = () => {
        const node = input.node as HTMLInputElement;
        node.value = node.value.replace(/[^\d]/g, '');
      };
    });
    const confirmBtn = new Component(formContainer.node, 'button', 'form-btn', 'confirm');

    confirmBtn.node.onclick = () => {
      let validationArr: boolean[] = [];
      this.userData.forEach((input, i) => {
        const fieldVal = (input.node as HTMLInputElement).value;
        const validation = this.validateUserField(userDataFields[i], fieldVal);

        validationArr.push(validation);
        if (!validation) {
          this.errFields.get(userDataFields[i])?.node.classList.add('error_active');
          input.node.classList.add('input_active');
        } else {
          this.errFields.get(userDataFields[i])?.node.classList.remove('error_active');
          input.node.classList.remove('input_active');
        }
      });

      validationArr = validationArr.filter((validation) => validation === false);

      let validation = true;
      this.cardData.forEach((input, i) => {
        const node = input.node as HTMLInputElement;
        if (i === 3) {
          validation = this.validateCardNumber();
        }
        if (i === 4 && node.value.length !== 5) {
          validation = false;
          this.errFields.get('expire')?.node.classList.add('card-error_active');
        } else if (i === 4) {
          this.errFields.get('expire')?.node.classList.remove('card-error_active');
        }
        if (i === 5 && node.value.length !== 3) {
          validation = false;
          this.errFields.get('cvc')?.node.classList.add('card-error_active');
        } else if (i === 5) {
          this.errFields.get('cvc')?.node.classList.remove('card-error_active');
        }
      });

      if (!validationArr.length && validation) {
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
      }
    };

    this.node.onclick = (e) => {
      if (e.target === this.node) this.node.classList.remove('modal-active');
    };
  }

  restrictPhoneNumberInput = (phone: Component) => {
    const phoneNode = phone.node as HTMLInputElement;
    const curValue = phoneNode.value;
    const prevValue = curValue.slice(0, curValue.length - 1);
    const last = curValue.slice(curValue.length - 1);

    if (curValue.length === 1 && curValue !== '+') {
      phoneNode.value = curValue.replace(/./g, '');
    } else if (
      (curValue.length >= 2 && curValue.length <= 10 && !/\d/.test(last)) ||
      curValue.length > 10
    ) {
      phoneNode.value = prevValue;
    }
  };

  validateUserField = (fieldName: string, fieldVal: string) => {
    let isValid = true;
    if (fieldName === 'name' || fieldName === 'address') {
      isValid = this.validateNameOrAddress(fieldName, fieldVal);
    }
    if (fieldName === 'phone' || fieldName === 'email') {
      isValid = this.validatePhoneOrEmail(fieldName, fieldVal);
    }
    return isValid;
  };

  checkWordsLengthValidity = (str: string, minWordLength: number) => {
    const words = str.trim().split(' ');
    const regExp = minWordLength === 5 ? /^\w{5}/ : /^\w{3}/;
    const validWords = words.filter((word) => regExp.test(word));
    return words.length === validWords.length;
  };

  checkWordsNumValidity = (str: string, minWordsNum: number) => {
    return str.trim().split(' ').length >= minWordsNum;
  };

  validateCardNumber = () => {
    let digitsNum = 0;
    this.cardData.forEach((input, i) => {
      if (i <= 3) {
        const node = input.node as HTMLInputElement;
        digitsNum += node.value.length;
      }
    });
    if (digitsNum !== 16) {
      this.errFields.get('card number')?.node.classList.add('card-error_active');
    } else {
      this.errFields.get('card number')?.node.classList.remove('card-error_active');
    }
    return digitsNum === 16;
  };

  validatePhoneOrEmail = (fieldName: string, fieldVal: string) => {
    const pattern = fieldName === 'phone' ? /^\+\d{9}/ : /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return pattern.test(fieldVal);
  };

  validateNameOrAddress = (fieldName: string, fieldVal: string) => {
    const [numLimit, lengthLimit] = fieldName === 'name' ? [2, 3] : [3, 5];
    if (
      !this.checkWordsNumValidity(fieldVal, numLimit) ||
      !this.checkWordsLengthValidity(fieldVal, lengthLimit)
    ) {
      return false;
    }
    return true;
  };
}
