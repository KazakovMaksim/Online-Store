import { Component } from '../component';
import { changeQueryParameterValues, countProductAmount } from '../../helpers/filter';
import './CheckboxFilter.scss';
import { Card } from '../Card/card';

export class CheckboxFilter extends Component {
  filterGroup = new Component(null, 'div', 'filter-group');
  queryParamsStr: string;
  filterCheckboxes: Component[] = [];

  onCheckbox: () => void = () => console.log();

  constructor(groups: string[], filterListName: string, allCards: Card[]) {
    super(null, 'div', 'filter');

    this.queryParamsStr = new URL(window.location.href).searchParams.getAll(filterListName)[0];
    new Component(this.node, 'p', 'filter-title', filterListName);
    this.node.append(this.filterGroup.node);

    groups.forEach((group, i) => {
      const filterField = new Component(this.filterGroup.node, 'div', 'filter-field');

      const checkbox = new Component(null, 'input', 'checkbox_filter-check');
      this.filterCheckboxes.push(checkbox);
      checkbox.node.setAttribute('type', 'checkbox');
      if (this.queryParamsStr && this.queryParamsStr.indexOf(group) >= 0) {
        (checkbox.node as HTMLInputElement).checked = true;
      }

      const label = new Component(null, 'label', 'checkbox_filter-label', group);
      filterField.node.append(checkbox.node, label.node);
      if (i >= 5) {
        filterField.node.classList.add('hidden');
      }

      const categoriesTable = countProductAmount(allCards, 'category');
      const brandsTable = countProductAmount(allCards, 'brand');
      const amount =
        filterListName === 'brand' ? brandsTable.get(group) : categoriesTable.get(group);
      const stockAmount = new Component(null, 'span', 'filter-amount', `${amount}/${amount}`);
      filterField.node.append(checkbox.node, label.node, stockAmount.node);

      checkbox.node.onclick = () => {
        if ((checkbox.node as HTMLInputElement).checked) {
          this.updateQueryInURL(group, filterListName, 'add');
        } else {
          this.updateQueryInURL(group, filterListName, 'del');
        }
        this.onCheckbox();
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
    this.queryParamsStr = new URL(window.location.href).searchParams.getAll(parameterName)[0];
    if (window.location.href.indexOf('?') < 0) {
      newUrl.searchParams.set(parameterName, parameterValue);
    } else {
      changeQueryParameterValues(
        parameterValue,
        parameterName,
        operation,
        this.queryParamsStr,
        newUrl,
      );
    }
    history.pushState(null, '', newUrl.href);
    this.queryParamsStr = new URL(window.location.href).searchParams.getAll(parameterName)[0];
  }
}
