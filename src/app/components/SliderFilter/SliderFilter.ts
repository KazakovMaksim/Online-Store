import { Component } from '../component';
import noUiSlider from '../../../../node_modules/nouislider/dist/nouislider';
import '../../../../node_modules/nouislider/dist/nouislider.css';
import { target } from '../../../../node_modules/nouislider/dist/nouislider';
import './SliderFilter.scss';

export class SliderFilter extends Component {
  constructor(listName: string, filterRange: number[]) {
    super(null, 'div', 'filter');
    const [min, max] = filterRange;
    new Component(this.node, 'p', 'filter-title', listName);
    const filterInfo = new Component(this.node, 'div', 'filter-info');
    const filterFrom = new Component(filterInfo.node, 'div', 'filter-from', `${min}`);
    const filterTo = new Component(filterInfo.node, 'div', 'filter-to', `${max}`);

    const rangeContainer = new Component(this.node, 'div', 'range-container');
    noUiSlider.create(rangeContainer.node, {
      start: [min, max],
      connect: true,
      range: {
        min: min,
        max: max,
      },
    });

    const range = rangeContainer.node as target;
    range.noUiSlider?.on('update', () => {
      const [valueLeft, valueRight] = [range.noUiSlider?.get(true)].toString().split(',');

      filterTo.node.innerText = Math.floor(+valueRight).toString();
      filterFrom.node.innerText = Math.floor(+valueLeft).toString();
    });
  }
}
