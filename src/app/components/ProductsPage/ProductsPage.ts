import { Component } from '../component';
import { Card } from '../Card/card';
import { products } from '../../data/products';
import { CheckboxFilter } from '../CheckboxFilter/CheckboxFilter';
import './ProductsPage.scss';
import { countRange, formCollection, updateQueryInURL } from '../../helpers/filter';
import { SliderFilter } from '../SliderFilter/SliderFilter';
import { Product } from '../../types/interface';

export class ProductsPage extends Component {
  controlsContainer = new Component(this.node, 'div', 'controls-container');
  productsContainer = new Component(this.node, 'div', 'products-container');
  productList: Component;
  productsFound: Component;
  sortOptions: Component;
  categoryList: string[] = formCollection(products.products, 'category');
  brandList: string[] = formCollection(products.products, 'brand');
  allCards: Card[] = [];
  filterCards: Card[] = this.allCards;

  categoryFilter: CheckboxFilter;
  brandFilter: CheckboxFilter;
  priceFilter: SliderFilter;
  stockFilter: SliderFilter;

  updateQtyDisplay() {
    const qty = (this.productList.node as HTMLElement).children.length;
    this.productsFound.node.textContent = String(qty);
  }

  useFilters(
    categoryQuery = this.categoryFilter.queryParamsStr,
    brandQuery = this.brandFilter.queryParamsStr,
  ) {
    const categoryArr = categoryQuery ? categoryQuery.split('↕') : [];
    const brandArr = brandQuery ? brandQuery.split('↕') : [];

    let newCards: Card[] = [...this.allCards];

    if (categoryQuery) {
      newCards = newCards.filter((card) => categoryArr.indexOf(card.category) >= 0);
    }
    if (brandQuery) {
      newCards = newCards.filter((card) => brandArr.indexOf(card.brand) >= 0);
    }
    if (this.priceFilter.paramsList) {
      const [leftVal, rightVal] = this.priceFilter.sliderValues;
      newCards = newCards.filter((card) => card.price >= +leftVal && card.price <= +rightVal);
    }
    if (this.stockFilter.paramsList) {
      const [leftVal, rightVal] = this.stockFilter.sliderValues;
      newCards = newCards.filter((card) => card.stock >= +leftVal && card.stock <= +rightVal);
    }

    this.filterCards = [...newCards];
    this.loadCards(this.filterCards);
    this.priceFilter.fillBoxValues(countRange(this.filterCards, 'price'));
    this.stockFilter.fillBoxValues(countRange(this.filterCards, 'stock'));
    this.fixLastItemsDisplay();
  }

  loadCards(cards = this.filterCards) {
    const productList = this.productList.node;
    const paramsListStr = new URL(window.location.href).searchParams.getAll('sort')[0];
    const sortIndex = paramsListStr
      ? +paramsListStr
      : (this.sortOptions.node as HTMLSelectElement).selectedIndex;

    if (sortIndex > 0) {
      if (sortIndex === 1) {
        cards.sort((a: Card, b: Card) => a.price - b.price);
      }
      if (sortIndex === 2) {
        cards.sort((a: Card, b: Card) => b.price - a.price);
      }
      if (sortIndex === 3) {
        cards.sort((a: Card, b: Card) => a.rating - b.rating);
      }
      if (sortIndex === 4) {
        cards.sort((a: Card, b: Card) => b.rating - a.rating);
      }
    }
    productList.textContent = '';
    cards.forEach((card) => {
      productList.append(card.node);
    });
    this.updateQtyDisplay();
  }

  onCheckBoxHandle() {
    this.useFilters();
    const rangePrice = countRange(this.filterCards, 'price');
    const rangeStock = countRange(this.filterCards, 'stock');
    const maxRangePrice = countRange(this.allCards, 'price');
    const maxRangeStock = countRange(this.allCards, 'stock');
    if (rangePrice.join('') !== '') {
      this.changeSliderFilterVal(rangePrice, rangeStock);
    } else {
      this.priceFilter.slider.noUiSlider?.set(maxRangePrice);
      this.priceFilter.fillBoxValues(['-', '-']);
      this.stockFilter.slider.noUiSlider?.set(maxRangeStock);
      this.stockFilter.fillBoxValues(['-', '-']);
    }
  }

  changeSliderFilterVal(rangePrice: string[], rangeStock: string[]) {
    this.priceFilter.slider.noUiSlider?.set(rangePrice);
    this.priceFilter.fillBoxValues(rangePrice);
    this.stockFilter.slider.noUiSlider?.set(rangeStock);
    this.stockFilter.fillBoxValues(rangeStock);
  }

  resetFilters = () => {
    this.brandFilter.filterCheckboxes.forEach(
      (checkbox) => ((checkbox.node as HTMLInputElement).checked = false),
    );
    this.categoryFilter.filterCheckboxes.forEach(
      (checkbox) => ((checkbox.node as HTMLInputElement).checked = false),
    );
    this.filterCards = [...this.allCards];
    const newUrl = new URL(window.location.href);
    history.pushState(null, '', `${newUrl.origin}/${newUrl.hash}`);
    (this.sortOptions.node as HTMLSelectElement).selectedIndex = 0;
    this.loadCards();
    const rangePrice = countRange(this.filterCards, 'price');
    const rangeStock = countRange(this.filterCards, 'stock');
    this.changeSliderFilterVal(rangePrice, rangeStock);
  };

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', 'products-page wrapper');

    // two main blocks in product-container
    const listSettings = new Component(this.productsContainer.node, 'article', 'list-settings');
    const productList = new Component(this.productsContainer.node, 'div', 'products-list');
    this.productList = productList;

    // settings list components
    this.sortOptions = new Component(listSettings.node, 'select', 'sort-options');

    const sortLable = new Component(this.sortOptions.node, 'option', 'sort-lable', 'Sort options:')
      .node as HTMLOptionElement;

    sortLable.selected = true;
    sortLable.disabled = true;

    ['price ASC', 'price DESC', 'rating ASC', 'rating DESC'].forEach((sort) => {
      (
        new Component(this.sortOptions.node, 'option', 'sort-item', `Sort by ${sort}`)
          .node as HTMLOptionElement
      ).value = sort;
    });
    const paramsListStr = new URL(window.location.href).searchParams.getAll('sort')[0];
    (this.sortOptions.node as HTMLSelectElement).selectedIndex = paramsListStr ? +paramsListStr : 0;

    // product found lable
    const productFoundLable = new Component(listSettings.node, 'p', 'product-found-lable');
    this.productsFound = new Component(productFoundLable.node, 'span', 'product-found-qty', '0');
    new Component(productFoundLable.node, 'span', 'product-found-text', ' Product Found');

    // decorative line - hr
    new Component(listSettings.node, 'div', 'deco-line');

    // items display buttons
    const buttonsContainer = new Component(listSettings.node, 'div', 'btns-container');
    const btnGridDisplay = new Component(
      buttonsContainer.node,
      'button',
      'btn btn-grid-display active',
    );
    const btnRowDisplay = new Component(buttonsContainer.node, 'button', 'btn btn-row-display');
    new Component(btnGridDisplay.node, 'img', 'grid-icon');
    new Component(btnRowDisplay.node, 'img', 'row-icon');

    function changeItemsDisplay(event: Event) {
      const currentBtn = event.currentTarget as HTMLElement;
      for (const button of buttonsContainer.node.children) {
        button.classList.remove('active');
      }
      currentBtn.classList.add('active');
      if (currentBtn.classList.contains('btn-row-display'))
        productList.node.classList.add('row-display');
      else productList.node.classList.remove('row-display');
    }

    for (const button of buttonsContainer.node.children) {
      button.addEventListener('click', changeItemsDisplay);
    }

    products.products.forEach((product: Product) =>
      this.allCards.push(new Card(this.productList.node, product)),
    );

    // implement filters block
    const priceRange = countRange(products.products, 'price');
    const stockRange = countRange(products.products, 'stock');

    const filterButtons = new Component(this.controlsContainer.node, 'div', 'filter-buttons');
    const resetFilterBtn = new Component(filterButtons.node, 'button', 'btn', 'Reset Filters');
    resetFilterBtn.node.onclick = () => {
      this.resetFilters();
    };
    const copyLinkBtn = new Component(filterButtons.node, 'button', 'btn', 'Copy Link');

    this.categoryFilter = new CheckboxFilter(this.categoryList, 'category', this.allCards);
    this.categoryFilter.onCheckbox = () => {
      this.onCheckBoxHandle();
    };

    this.brandFilter = new CheckboxFilter(this.brandList, 'brand', this.allCards);
    this.brandFilter.onCheckbox = () => {
      this.onCheckBoxHandle();
    };

    this.priceFilter = new SliderFilter('price', priceRange);
    this.priceFilter.onSlider = () => {
      this.useFilters();
    };

    this.stockFilter = new SliderFilter('stock', stockRange);
    this.stockFilter.onSlider = () => {
      this.useFilters();
    };

    this.controlsContainer.node.append(
      this.categoryFilter.node,
      this.brandFilter.node,
      this.priceFilter.node,
      this.stockFilter.node,
    );

    this.sortOptions.node.addEventListener('change', () => {
      const index = (this.sortOptions.node as HTMLSelectElement).selectedIndex;
      const paramsList = new URL(window.location.href).searchParams.getAll('sort')[0];
      updateQueryInURL(String(index), 'sort', paramsList);
    });
    this.sortOptions.node.addEventListener('change', () => this.loadCards());
    this.sortOptions.node.addEventListener('change', this.fixLastItemsDisplay);

    this.useFilters();

    this.updateQtyDisplay();

    this.fixLastItemsDisplay();

    window.addEventListener('resize', this.fixLastItemsDisplay);
  }

  fixLastItemsDisplay() {
    const products = this.productList.node.children;
    [...products].forEach((el) => el.classList.remove('fix-width'));
    if (window.innerWidth > 1239) {
      const productsQty = products.length;
      const remain = productsQty % 3;
      const remainItems = [...this.productList.node.children].filter(
        (el, indx) => indx + 1 > productsQty - remain,
      );
      remainItems.forEach((el) => el.classList.add('fix-width'));
    }
  }
}
