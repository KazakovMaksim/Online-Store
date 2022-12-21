import { Component } from '../component';
import './CheckboxFilter.scss';

export class CheckboxFilter extends Component {
  filterGroup = new Component(null, 'div', 'filter-group');

  constructor(categoryList: string[], listName: string) {
    super(null, 'div', 'filter');
    new Component(this.node, 'p', 'filter-title', listName);
    this.node.append(this.filterGroup.node);

    categoryList.forEach((cat, i) => {
      const filterField = new Component(this.filterGroup.node, 'div', 'filter-field');
      const checkbox = new Component(null, 'input', 'checkbox_filter-check');
      checkbox.node.setAttribute('type', 'checkbox');
      const label = new Component(null, 'label', 'checkbox_filter-label', cat);
      filterField.node.append(checkbox.node, label.node);
      if (i >= 5) {
        filterField.node.classList.add('hidden');
      }
    });

    const filterSpoiler = new Component(this.node, 'div', 'filter-spoiler');
    new Component(filterSpoiler.node, 'a');
    const spoilerText = new Component(filterSpoiler.node, 'span', '', 'показать еще ∨');

    filterSpoiler.node.onclick = () => {
      this.changeFilterContent(spoilerText.node);
    };
  }

  changeFilterContent(spoilerText: HTMLElement) {
    const text = spoilerText.innerText;
    spoilerText.innerText = text === 'скрыть ∧' ? 'показать еще ∨' : 'скрыть ∧';

    Array.from(this.filterGroup.node.children).forEach((child, i) => {
      if (i >= 5) {
        child.classList.toggle('hidden');
      }
    });
  }
}
