import { Component } from '../component';
import { changeQueryParameterValues } from '../../helpers/filter';
import './CheckboxFilter.scss';

export class CheckboxFilter extends Component {
  filterGroup = new Component(null, 'div', 'filter-group');

  category: string[] = new URL(window.location.href).searchParams.getAll('category');
  brand: string[] = new URL(window.location.href).searchParams.getAll('brand');

  onCheckbox: (categoryQuery: string[], brandQuery: string[]) => void = () => console.log();

  constructor(categoryList: string[], listName: string) {
    super(null, 'div', 'filter');
    new Component(this.node, 'p', 'filter-title', listName);
    this.node.append(this.filterGroup.node);

    categoryList.forEach((catName, i) => {
      const filterField = new Component(this.filterGroup.node, 'div', 'filter-field');
      const checkbox = new Component(null, 'input', 'checkbox_filter-check');
      checkbox.node.setAttribute('type', 'checkbox');
      const filterValuesStr = `${this.category[0]}|${this.brand}`;
      if (filterValuesStr.indexOf(catName) >= 0) {
        checkbox.node.setAttribute('checked', '');
      }
      const label = new Component(null, 'label', 'checkbox_filter-label', catName);
      filterField.node.append(checkbox.node, label.node);
      if (i >= 5) {
        filterField.node.classList.add('hidden');
      }
      checkbox.node.onclick = () => {
        if ((checkbox.node as HTMLInputElement).checked) {
          this.updateQueryInURL(catName, listName, 'add');
        } else {
          this.updateQueryInURL(catName, listName, 'del');
        }
        this.onCheckbox([...this.category], [...this.brand]);
      };
    });

    const filterSpoiler = new Component(this.node, 'div', 'filter-spoiler');
    new Component(filterSpoiler.node, 'a');
    const spoilerText = new Component(filterSpoiler.node, 'span', '', 'show more ∨');

    filterSpoiler.node.onclick = () => {
      this.changeFilterContent(spoilerText.node);
    };
  }

  applyFilter() {
    throw new Error('Method not implemented.');
  }

  changeFilterContent(spoilerText: HTMLElement) {
    const text = spoilerText.innerText;
    spoilerText.innerText = text === 'hide ∧' ? 'show more ∨' : 'hide ∧';

    Array.from(this.filterGroup.node.children).forEach((child, i) => {
      if (i >= 5) {
        child.classList.toggle('hidden');
      }
    });
  }

  updateQueryInURL(parameterValue: string, parameterName: string, operation: string) {
    const newUrl = new URL(window.location.href);
    this.category = newUrl.searchParams.getAll('category');
    this.brand = newUrl.searchParams.getAll('brand');

    if (window.location.href.indexOf('?') < 0) {
      newUrl.searchParams.set(parameterName.toLowerCase(), parameterValue);
    } else {
      if (parameterName.toLowerCase() === 'category') {
        changeQueryParameterValues(
          parameterValue,
          parameterName,
          operation,
          this.category[0],
          newUrl,
        );
      }
      if (parameterName.toLowerCase() === 'brand') {
        changeQueryParameterValues(parameterValue, parameterName, operation, this.brand[0], newUrl);
      }
    }
    history.pushState(null, '', newUrl.href);
    this.category = newUrl.searchParams.getAll('category');
    this.brand = newUrl.searchParams.getAll('brand');
  }
}
