import { Component } from '../component';
import './card.scss';

export class Card extends Component {
  id: number;
  mainImage: HTMLElement = new Component(this.node, 'div', 'product-image').node;
  descriptionContainer: HTMLElement = new Component(this.node, 'div', 'desc-container').node;
  title: HTMLElement = new Component(this.descriptionContainer, 'p', 'product-title').node;
  description: HTMLElement;
  price: number;
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
    const maxStarsWidth = 82.6667;
    new Component(
      this.descriptionContainer,
      'div',
      'star-rating',
      '★ ★ ★ ★ ★',
    ).node.style.width = `${(82.6667 / 5) * rating}px`;
    const priceAddContainer = new Component(
      this.descriptionContainer,
      'div',
      'price-add-container',
    );
    new Component(priceAddContainer.node, 'div', 'product-price', `€${price}`).node;
    this.price = price;
    const btnDetails = new Component(priceAddContainer.node, 'button', 'btn btn-details', 'Details')
      .node;
    const btnAdd = new Component(
      priceAddContainer.node,
      'button',
      'btn btn-add-product',
      'Add to Cart',
    ).node;

    this.description = new Component(
      this.descriptionContainer,
      'p',
      'product-description',
      `${description}`,
    ).node;

    // hidden card(product)'s properties
    this.id = id;
    this.discount = discount;
    this.brand = brand;
    this.rating = rating;
    this.category = category;
    this.stock = stock;
    this.images = images;

    // buttons handlers
    btnDetails.addEventListener('click', () => {
      window.location.hash = `product-details/${this.id}`;
    });
  }
}
