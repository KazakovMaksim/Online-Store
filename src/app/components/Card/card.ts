import { Component } from '../component';
import './card.scss';

export class Card extends Component {
  id: number;
  mainImage: HTMLElement = new Component(this.node, 'div', 'product-image').node;
  title: HTMLElement = new Component(this.node, 'p', 'product-title').node;
  description: HTMLElement;
  price: HTMLElement;
  discount: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];

  constructor(
    parentNode: HTMLElement | null,
    id: number,
    title: string,
    description: string,
    price: number,
    discount: number,
    rating: number,
    stock: number,
    brand: string,
    category: string,
    thumbnail: string,
    images: string[],
  ) {
    // visible card's pieces
    super(parentNode, 'div', 'prodcut-card');
    this.mainImage.style.backgroundImage = `url(${thumbnail})`;
    this.title.textContent = title;
    const priceAddContainer = new Component(this.node, 'div', 'price-add-container');
    this.price = new Component(priceAddContainer.node, 'div', 'product-price', `€${price}`).node;
    const btnAdd = new Component(priceAddContainer.node, 'button', 'btn-add-product', 'Add').node;
    this.description = new Component(this.node, 'p', 'product-description', `${description}`).node;

    // hidden card(product)'s properties
    this.id = id;
    this.discount = discount;
    this.brand = brand;
    this.rating = rating;
    this.category = category;
    this.stock = stock;
    this.images = images;
  }
}
