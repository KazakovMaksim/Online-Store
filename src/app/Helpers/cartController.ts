import { products } from '../data/products';
import { CartItem } from '../types/interface';

export class CartController {
  getCartItem(id: number) {
    const item = products.products.find((product) => product.id === id);
    if (item) {
      const cartItem: CartItem = { id: item.id, cost: item.price, quantity: 1 };
      return cartItem;
    }
  }

  static initCart() {
    if (!localStorage.getItem('Cart')) localStorage.setItem('Cart', '[]');
  }

  static add(id: number) {
    this.initCart();
    const item = products.products.find((product) => product.id === id);
    if (item) {
      const cartItem: CartItem = { id: item.id, cost: item.price, quantity: 1 };
      const cartArray: CartItem[] | null = this.getCartItems();
      const existingItem = cartArray?.find((item) => item.id === cartItem.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else cartArray?.push(cartItem);
      this.setCartItems(cartArray);
    }
    this.setCartQty();
    this.setTotalAmount();
  }

  static decreaseItemQty(id: number) {
    const cartItems = this.getCartItems();
    let newCartItems: CartItem[] | undefined;
    const itemToSearch = cartItems?.find((item) => item.id === id);
    if (itemToSearch?.quantity ? itemToSearch?.quantity > 1 : false) {
      newCartItems = cartItems?.map((item) => {
        if (item.id === id) {
          item.quantity--;
        }
        return item;
      });
    }
    if (newCartItems) this.setCartItems(newCartItems);
    this.setCartQty();
    this.setTotalAmount();
  }

  static remove(id: number) {
    const cartItems = this.getCartItems();
    const newCartItems: CartItem[] | undefined = cartItems?.filter((item: CartItem) => {
      return item.id !== id;
    });
    if (newCartItems) this.setCartItems(newCartItems);
    this.setCartQty();
    this.setTotalAmount();
  }

  static getCartItems(): CartItem[] | null {
    const cart = localStorage.getItem('Cart');
    return cart ? (JSON.parse(cart) as Array<CartItem>) : null;
  }

  static setCartItems(cartItems: CartItem[] | null): void {
    if (!cartItems) return;
    localStorage.setItem('Cart', JSON.stringify(cartItems));
  }

  static updateCartQty: (qty: number) => void = () => null;
  static updateTotalAmount: (amount: number) => void = () => null;

  static setCartQty() {
    this.updateCartQty(this.getItemsQty());
  }

  static setTotalAmount() {
    this.updateTotalAmount(this.getTotalAmount());
  }

  static getTotalAmount() {
    let amount = 0;
    const cartItems = this.getCartItems();
    cartItems?.forEach((item) => (amount += item.cost * item.quantity));
    return amount;
  }

  static getItemQty(id: number) {
    const items = this.getCartItems();
    return items?.find((item) => item.id === id)?.quantity;
  }

  static getItemsQty() {
    let qty = 0;
    this.getCartItems()?.forEach((item) => (qty += item.quantity));
    return qty;
  }
}
