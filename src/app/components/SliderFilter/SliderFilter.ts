import { Component } from '../component';
import noUiSlider from '../../../../node_modules/nouislider/dist/nouislider';
import '../../../../node_modules/nouislider/dist/nouislider.css';
import { target } from '../../../../node_modules/nouislider/dist/nouislider';
import './SliderFilter.scss';

export class SliderFilter extends Component {
  rangeContainer: Component;
  range: target;

  constructor(listName: string, filterRange: number[]) {
    super(null, 'div', 'filter');
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

    this.range = this.rangeContainer.node as target;
    this.range.noUiSlider?.on('update', () => {
      const [valueLeft, valueRight] = [this.range.noUiSlider?.get(true)].toString().split(',');

      filterTo.node.innerText = Math.floor(+valueRight).toString();
      filterFrom.node.innerText = Math.floor(+valueLeft).toString();
    });
  }
}
