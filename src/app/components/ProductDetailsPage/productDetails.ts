import { products } from '../../data/products';
import { CartController } from '../../Helpers/cartController';
import { Product } from '../../types/interface';
import { Component } from '../component';
import './productDetails.scss';

export class ProductDetailsPage extends Component {
  constructor(parentNode: HTMLElement | null, productId?: number) {
    super(parentNode, 'div', 'product-details-page wrapper');
    const selectedProduct: Product = products.products.find(
      (product) => product.id === productId,
    ) as Product;

    // primary blocks
    // bread crumbs block
    new Component(
      this.node,
      'div',
      'bread-crumbs-container',
      `STORE > ${selectedProduct.category} > ${selectedProduct.brand} > ${selectedProduct.title}`,
    );
    const backButtonBlock = new Component(this.node, 'div', 'back-button-container');
    const infoBlock = new Component(this.node, 'div', 'info-container');
    const photosBlock = new Component(infoBlock.node, 'div', 'photos-container');
    const detailsBlock = new Component(infoBlock.node, 'div', 'details-container');
    const buttonsBlock = new Component(this.node, 'div', 'buttons-container');

    // photos block
    const bigPhotoBlock = new Component(photosBlock.node, 'div', 'big-img');
    const photosList = new Component(photosBlock.node, 'div', 'photos-list');

    bigPhotoBlock.node.style.backgroundImage = `url(${String(selectedProduct?.thumbnail)})`;
    selectedProduct?.images.forEach((img) => {
      const photoItem = new Component(photosList.node, 'div', 'photo-item');
      photoItem.node.style.backgroundImage = `url(${img})`;
      photoItem.node.addEventListener('click', () => {
        bigPhotoBlock.node.style.backgroundImage = `url(${String(img)})`;
        for (const listItem of photosList.node.children) {
          listItem.classList.remove('selected');
        }
        (photoItem.node as HTMLImageElement).classList.add('selected');
      });
      if (img === selectedProduct?.thumbnail) photoItem.node.classList.add('selected');
    });

    // details block
    for (const [key, value] of Object.entries(selectedProduct)) {
      if (String(key) === 'id' || String(key) === 'thumbnail' || String(key) === 'images') continue;
      const titleRow = new Component(detailsBlock.node, 'div', `${key}-row detail-row`);
      let keyToInsert = key;
      let valueToInsert = value;
      if (String(key) === 'discount') keyToInsert = 'discount %';
      if (String(key) === 'price') valueToInsert = `€${value}`;
      new Component(titleRow.node, 'p', 'head-line', `${keyToInsert}`);
      new Component(titleRow.node, 'p', 'desc-item', `${valueToInsert}`);
    }

    // buttons block
    const btnAdd = new Component(buttonsBlock.node, 'button', 'btn btn-desc-add', 'Add to Cart');
    const btnBuyNow = new Component(buttonsBlock.node, 'button', 'btn btn-desc-buy-now', 'Buy Now');

    btnAdd.node.addEventListener('click', () => {
      if (!this.node.classList.contains('in-cart')) {
        this.node.classList.add('in-cart');
        btnAdd.node.textContent = 'Drop from Cart';
        CartController.add(selectedProduct.id);
      } else {
        this.node.classList.remove('in-cart');
        btnAdd.node.textContent = 'Add to Cart';
        CartController.remove(selectedProduct.id);
      }
    });

    const updateBtnState = () => {
      if (CartController.getCartItems()?.find((item) => productId === item.id)) {
        this.node.classList.add('in-cart');
        btnAdd.node.textContent = 'Drop from Cart';
      }
    };

    updateBtnState();

    // back button block
    const btnBack = new Component(backButtonBlock.node, 'button', 'btn btn-back', 'Back');
    new Component(btnBack.node, 'div', 'left-arrow');
    btnBack.node.addEventListener('click', () => history.back());
  }
}
