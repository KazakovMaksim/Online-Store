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
  }

  static remove(id: number) {
    const cartItems = this.getCartItems();
    const newCartItems: CartItem[] | undefined = cartItems?.filter((item: CartItem) => {
      return item.id !== id;
    });
    if (newCartItems) this.setCartItems(newCartItems);
  }

  static getCartItems(): CartItem[] | null {
    const cart = localStorage.getItem('Cart');
    return cart ? (JSON.parse(cart) as Array<CartItem>) : null;
  }

  static setCartItems(cartItems: CartItem[] | null): void {
    if (!cartItems) return;
    localStorage.setItem('Cart', JSON.stringify(cartItems));
  }
}
