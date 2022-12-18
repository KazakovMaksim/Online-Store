import { Component } from '../component';
import { Card } from '../Card/card';
import { products } from '../../data/products';
import './ProductsPage.scss';

export class ProductsPage extends Component {
  controlsContainer = new Component(this.node, 'div', 'controls-container');

  productsContainer = new Component(this.node, 'div', 'products-container');

  productList: Component;

  productsFound: Component;

  updateQtyDisplay() {
    const qty = (this.productList.node as HTMLElement).children.length;
    this.productsFound.node.textContent = String(qty);
  }

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'products-page wrapper');

    // products.forEach((el) => {
    //   const card = new Card(null);
    //   card.productName.innerText = el.name;
    //   card.productSize.node.innerText = el.size;
    //   card.productShape.node.innerText = el.shape;
    //   this.productsContainer.node.append(card.node);
    // });

    // two main blocks in product-container
    const listSettings = new Component(this.productsContainer.node, 'article', 'list-settings');
    const productList = new Component(this.productsContainer.node, 'div', 'products-list');
    this.productList = productList;

    // settings list components
    const sortOptions = new Component(listSettings.node, 'select', 'sort-options');
    const sortLable = new Component(sortOptions.node, 'option', 'sort-lable', 'Sort options:')
      .node as HTMLOptionElement;

    sortLable.selected = true;
    sortLable.disabled = true;

    (
      new Component(sortOptions.node, 'option', 'sort-item', 'Sort by price ASC')
        .node as HTMLOptionElement
    ).value = 'price-ASC';
    (
      new Component(sortOptions.node, 'option', 'sort-item', 'Sort by price DESC')
        .node as HTMLOptionElement
    ).value = 'price-DESC';

    (
      new Component(sortOptions.node, 'option', 'sort-item', 'Sort by rating ASC')
        .node as HTMLOptionElement
    ).value = 'rating-ASC';
    (
      new Component(sortOptions.node, 'option', 'sort-item', 'Sort by rating DESC')
        .node as HTMLOptionElement
    ).value = 'rating-DESC';

    // product found lable
    const productFoundLable = new Component(listSettings.node, 'p', 'product-found-lable');
    this.productsFound = new Component(productFoundLable.node, 'span', 'product-found-qty', '0');
    new Component(productFoundLable.node, 'span', 'product-found-text', ' Product Found');

    // decorative line - hr
    new Component(listSettings.node, 'div', 'deco-line');

    // items display buttons
    const buttonsContainer = new Component(listSettings.node, 'div', 'btns-container');
    const btnGridDisplay = new Component(buttonsContainer.node, 'button', 'btn btn-grid-display');
    const btnRowDisplay = new Component(buttonsContainer.node, 'button', 'btn btn-row-display');
    new Component(btnGridDisplay.node, 'img', 'grid-icon');
    new Component(btnRowDisplay.node, 'img', 'row-icon');

    products.products.forEach(
      (el) =>
        new Card(
          this.productList.node,
          el.id,
          el.title,
          el.description,
          el.price,
          el.discountPercentage,
          el.rating,
          el.stock,
          el.brand,
          el.category,
          el.thumbnail,
          el.images,
        ),
    );

    this.updateQtyDisplay();

    fixLastItemsDisplay();

    window.addEventListener('resize', fixLastItemsDisplay);

    function fixLastItemsDisplay() {
      const products = productList.node.children;
      [...products].forEach((el) => el.classList.remove('fix-width'));
      if (window.innerWidth > 1239) {
        const productsQty = products.length;
        const remain = productsQty % 3;
        const remainItems = [...productList.node.children].filter(
          (el, indx) => indx + 1 > productsQty - remain,
        );
        remainItems.forEach((el) => el.classList.add('fix-width'));
      }
    }
  }
}
