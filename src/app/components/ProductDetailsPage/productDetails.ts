import { products } from '../../data/products';
import { product } from '../../types/interface';
import { Component } from '../component';
import './productDetails.scss';

export class ProductDetailsPage extends Component {
  constructor(parentNode: HTMLElement | null, productId?: number) {
    super(parentNode, 'div', 'product-details-page wrapper');
    const selectedProduct: product = products.products.find(
      (product) => product.id === productId,
    ) as product;

    // primary blocks
    const infoBlock = new Component(this.node, 'div', 'info-container');
    const photosBlock = new Component(infoBlock.node, 'div', 'photos-container');
    const detailsBlock = new Component(infoBlock.node, 'div', 'details-container');
    const buttonsBlock = new Component(this.node, 'div', 'buttons-container');

    // photos block
    const bigPhotoBlock = new Component(photosBlock.node, 'img', 'big-img');
    const photosList = new Component(photosBlock.node, 'div', 'photos-list');

    (bigPhotoBlock.node as HTMLImageElement).src = String(selectedProduct?.thumbnail);
    selectedProduct?.images.forEach((img) => {
      const photoItem = new Component(photosList.node, 'div', 'photo-item');
      photoItem.node.style.backgroundImage = `url(${img})`;
      photoItem.node.addEventListener('click', () => {
        (bigPhotoBlock.node as HTMLImageElement).src = String(img);
      });
    });

    // details block
    for (const [key, value] of Object.entries(selectedProduct)) {
      if (String(key) === 'id' || String(key) === 'thumbnail' || String(key) === 'images') continue;
      const titleRow = new Component(detailsBlock.node, 'div', `${key}-row detail-row`);
      let keyToInsert = key;
      let valueToInsert = value;
      if (String(key) === 'discountPercentage') keyToInsert = 'discount Percentage';
      if (String(key) === 'price') valueToInsert = `€${value}`;
      new Component(titleRow.node, 'p', 'head-line', `${keyToInsert}`);
      new Component(titleRow.node, 'p', 'desc-item', `${valueToInsert}`);
    }

    // buttons block
    const btnAdd = new Component(buttonsBlock.node, 'button', 'btn btn-desc-add', 'Add to Cart');
    const btnBuyNow = new Component(buttonsBlock.node, 'button', 'btn btn-desc-buy-now', 'Buy Now');
  }
}
