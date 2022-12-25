import { Component } from '../component';
import noUiSlider from '../../../../node_modules/nouislider/dist/nouislider';
import '../../../../node_modules/nouislider/dist/nouislider.css';
import { target } from '../../../../node_modules/nouislider/dist/nouislider';
import './SliderFilter.scss';
import { changeQueryParameterValues } from '../../helpers/filter';

export class SliderFilter extends Component {
  rangeContainer: Component;
  rangeSlider: target;
  range: number[];
  price = new URL(window.location.href).searchParams.getAll('price');
  stock = new URL(window.location.href).searchParams.getAll('stock');

  onSlider: (min: string, max: string) => void = () => console.log();

  constructor(listName: string, filterRange: number[]) {
    super(null, 'div', 'filter');
    this.range = filterRange;
    const [min, max] = filterRange;
    new Component(this.node, 'p', 'filter-title', listName);
    const filterInfo = new Component(this.node, 'div', 'filter-info');
    const filterFrom = new Component(filterInfo.node, 'div', 'filter-from', `${min}`);
    const filterTo = new Component(filterInfo.node, 'div', 'filter-to', `${max}`);

    this.rangeContainer = new Component(this.node, 'div', 'range-container');
    noUiSlider.create(this.rangeContainer.node, {
      start: [min, max],
      connect: true,
      range: {
        min: min,
        max: max,
      },
    });

    this.rangeSlider = this.rangeContainer.node as target;
    this.rangeSlider.noUiSlider?.on('update', () => {
      const [valueLeft, valueRight] = [this.rangeSlider.noUiSlider?.get(true)]
        .toString()
        .split(',');
      this.range = [Math.floor(+valueLeft), Math.floor(+valueRight)];
      filterTo.node.innerText = Math.floor(+valueRight).toString();
      filterFrom.node.innerText = Math.floor(+valueLeft).toString();
      this.onSlider(filterFrom.node.innerText, filterTo.node.innerText);
    });

    this.rangeSlider.noUiSlider?.on('change', () => {
      this.updateQueryInURL(this.range.join('|'), listName);
    });
  }

  updateQueryInURL(parameterValue: string, parameterName: string) {
    const newUrl = new URL(window.location.href);

    if (window.location.href.indexOf('?') < 0) {
      newUrl.searchParams.set(parameterName.toLowerCase(), parameterValue);
    } else {
      if (parameterName.toLowerCase() === 'price' && this.price) {
        changeQueryParameterValues(parameterValue, parameterName, 'update', this.price[0], newUrl);
      }
      if (parameterName.toLowerCase() === 'stock' && this.stock) {
        changeQueryParameterValues(parameterValue, parameterName, 'update', this.stock[0], newUrl);
      }
    }
    history.pushState(null, '', newUrl.href);
    this.price = newUrl.searchParams.getAll('price');
    this.stock = newUrl.searchParams.getAll('stock');
  }
}
