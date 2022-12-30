import { products } from '../data/products';
import { CartItem } from '../types/interface';

export class CartController {
  static add(id: number) {
    if (!localStorage.getItem('Cart')) localStorage.setItem('Cart', '[]');
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
    let qty = 0;
    const cartItems = this.getCartItems();
    cartItems?.forEach((item) => (qty += item.quantity));
    this.updateCartQty(qty);
  }

  static setTotalAmount() {
    let amount = 0;
    const cartItems = this.getCartItems();
    cartItems?.forEach((item) => (amount += item.cost));
    this.updateTotalAmount(amount);
  }
}
