import { expect, jest, test } from '@jest/globals';
import { CartController } from '../app/Helpers/cartController';
import { modal } from './testing-objects';

describe('testing modal validation', () => {
  test('name of 2 words more than 5 symbols length should return true', () => {
    expect(modal.validateNameOrAddress('name', 'Michael Jackson')).toBe(true);
  });

  test('name of 1 word should return false', () => {
    expect(modal.validateNameOrAddress('name', 'Michael')).toBeFalsy();
  });

  test('phone without + symbol should return false', () => {
    expect(modal.validatePhoneOrEmail('phone', '89494455322')).toBeFalsy();
  });

  test('phone with + and numbers length < 9 should return false', () => {
    expect(modal.validatePhoneOrEmail('phone', '+79494455')).toBeFalsy();
  });

  test('phone with + and numbers length >= 9 should return true', () => {
    expect(modal.validatePhoneOrEmail('phone', '+9494455872')).toBeTruthy();
  });

  test('phone should not contain any letters and other symbols except + at start of the string', () => {
    expect(modal.validatePhoneOrEmail('phone', '+9494455872a')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+94944558724545545G')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+94944558724+')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+94944558724-')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '-94944558724')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '*94944558724')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '*111111&11111')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+111111&11111')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+++++++++++++')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '+++++++++++++abcedefg')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '8848555353+')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '884855+5353')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('phone', '884855+5353')).toBeFalsy();
  });

  test('address of less then 3 words with length less then 5 letters and with no numbers should return false', () => {
    expect(modal.validateNameOrAddress('address', 'Michael')).toBeFalsy();
    expect(modal.validateNameOrAddress('address', 'CityCity country pla')).toBeFalsy();
    expect(modal.validateNameOrAddress('address', 'City country')).toBeFalsy();
    expect(modal.validateNameOrAddress('address', 'somewhere:3/4 country')).toBeFalsy();
    expect(modal.validateNameOrAddress('address', 'somewhere:3/4 123123123 address')).toBeFalsy();
    expect(
      modal.validateNameOrAddress('address', 'addressWithNumber123123123 123456abcdefg address'),
    ).toBeFalsy();
  });

  test('address of 3 words with length >= 5 letters should return true', () => {
    expect(modal.validateNameOrAddress('address', 'address address address')).toBeTruthy();
    expect(
      modal.validateNameOrAddress(
        'address',
        'addressaddressaddressaddress addressaddressaddress addressaddress',
      ),
    ).toBeTruthy();
  });

  test('email should be correct: contain @ and domain', () => {
    expect(modal.validatePhoneOrEmail('email', 'mail@mail.com')).toBeTruthy();
    expect(modal.validatePhoneOrEmail('email', '38383numberic@mail.com')).toBeTruthy();
    expect(modal.validatePhoneOrEmail('email', '38383numbericDogmail.com')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('email', '38383@.com')).toBeFalsy();
    expect(modal.validatePhoneOrEmail('email', '38383@domain.com')).toBeTruthy();
    expect(modal.validatePhoneOrEmail('email', `mail~!$%^&*_=+}{'?-.@domain.com`)).toBeTruthy();
    expect(modal.validatePhoneOrEmail('email', '!@domain.com')).toBeTruthy();
  });
});

describe('testing cart interactions', () => {
  test('add to 2 same items in a row should add only 1 element in localStorage', () => {
    CartController.add(1);
    CartController.add(1);
    expect(CartController.getCartItems()).toHaveLength(1);
  });

  test('decreaseItemQty function should not delete whole item if its qty > 1', () => {
    CartController.add(2);
    CartController.add(2);
    CartController.add(2);
    CartController.decreaseItemQty(2);
    const expectedItem = CartController.getCartItems()?.find((item) => item.id === 2);
    expect(expectedItem).toHaveProperty('quantity', 2);
  });

  test('remove function should delete whole item', () => {
    CartController.add(2);
    CartController.add(1);
    CartController.add(2);
    CartController.add(90);
    CartController.add(2);
    CartController.remove(2);
    const expectedItem = CartController.getCartItems()?.find((item) => item.id === 2);
    expect(expectedItem).toBeUndefined();
  });
});
