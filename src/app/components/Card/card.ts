import { Product } from '../../types/interface';
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

  constructor(parentNode: HTMLElement | null, product: Product) {
    // visible card's pieces
    super(parentNode, 'div', 'prodcut-card');
    this.mainImage.style.backgroundImage = `url(${product.thumbnail})`;
    this.title.textContent = product.title;
    new Component(
      this.descriptionContainer,
      'div',
      'star-rating',
      '★ ★ ★ ★ ★',
    ).node.style.width = `${(82.6667 / 5) * product.rating}px`;
    const priceAddContainer = new Component(
      this.descriptionContainer,
      'div',
      'price-add-container',
    );
    new Component(priceAddContainer.node, 'div', 'product-price', `€${product.price}`).node;
    this.price = product.price;
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
      `${product.description}`,
    ).node;

    // hidden card(product)'s properties
    this.id = product.id;
    this.discount = product.discount;
    this.brand = product.brand;
    this.rating = product.rating;
    this.category = product.category;
    this.stock = product.stock;
    this.images = product.images;

    // buttons handlers
    btnDetails.addEventListener('click', () => {
      window.location.hash = `product-details/${this.id}`;
    });
  }
}
