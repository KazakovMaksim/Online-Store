import { Component } from '../component';
import { changeQueryParameterValues } from '../Helpers/filter';
import './CheckboxFilter.scss';

export class CheckboxFilter extends Component {
  filterGroup = new Component(null, 'div', 'filter-group');

  constructor(categoryList: string[], listName: string) {
    super(null, 'div', 'filter');
    new Component(this.node, 'p', 'filter-title', listName);
    this.node.append(this.filterGroup.node);

    categoryList.forEach((catName, i) => {
      const filterField = new Component(this.filterGroup.node, 'div', 'filter-field');
      const checkbox = new Component(null, 'input', 'checkbox_filter-check');
      checkbox.node.setAttribute('type', 'checkbox');
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
      };
    });

    const filterSpoiler = new Component(this.node, 'div', 'filter-spoiler');
    new Component(filterSpoiler.node, 'a');
    const spoilerText = new Component(filterSpoiler.node, 'span', '', 'show more ∨');

    filterSpoiler.node.onclick = () => {
      this.changeFilterContent(spoilerText.node);
    };
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
    const category = newUrl.searchParams.getAll('category');
    const brand = newUrl.searchParams.getAll('brand');

    if (window.location.href.indexOf('?') < 0) {
      newUrl.searchParams.set(parameterName.toLowerCase(), parameterValue);
    } else {
      if (parameterName.toLowerCase() === 'category') {
        changeQueryParameterValues(parameterValue, parameterName, operation, category, newUrl);
      }
      if (parameterName.toLowerCase() === 'brand') {
        changeQueryParameterValues(parameterValue, parameterName, operation, brand, newUrl);
      }
    }
    history.pushState(null, '', newUrl.href);
  }
}
