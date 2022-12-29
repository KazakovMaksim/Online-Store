import { Component } from '../component';
import noUiSlider from '../../../../node_modules/nouislider/dist/nouislider';
import '../../../../node_modules/nouislider/dist/nouislider.css';
import { target } from '../../../../node_modules/nouislider/dist/nouislider';
import './SliderFilter.scss';
import { updateQueryInURL } from '../../helpers/filter';
import { app } from '../../..';
import { ProductsPage } from '../ProductsPage/ProductsPage';

export class SliderFilter extends Component {
  rangeContainer: Component;
  slider: target;
  sliderValues: string[];
  paramsList: string;

  onSlider: () => void = () => console.log();

  constructor(filterListName: string, filterRange: string[]) {
    super(null, 'div', 'filter');

    this.paramsList = new URL(window.location.href).searchParams.getAll(filterListName)[0];
    const leftVal = this.paramsList ? this.paramsList.split('↕')[0] : filterRange[0];
    const rightVal = this.paramsList ? this.paramsList.split('↕')[1] : filterRange[1];
    this.sliderValues = [leftVal, rightVal];

    const [min, max] = filterRange;
    new Component(this.node, 'p', 'filter-title', filterListName);
    const filterInfo = new Component(this.node, 'div', 'filter-info');
    const filterFrom = new Component(filterInfo.node, 'div', 'filter-from', min);
    const filterTo = new Component(filterInfo.node, 'div', 'filter-to', max);

    this.rangeContainer = new Component(this.node, 'div', 'range-container');
    noUiSlider.create(this.rangeContainer.node, {
      start: [leftVal, rightVal],
      connect: true,
      range: {
        min: +min,
        max: +max,
      },
    });

    this.slider = this.rangeContainer.node as target;
    this.slider.noUiSlider?.on('update', () => {
      const [leftVal, rightVal] = [this.slider.noUiSlider?.get(true)]
        .toString()
        .split(',')
        .map((el) => Math.floor(+el).toString());
      this.sliderValues = [leftVal, rightVal];
      filterFrom.node.innerText = leftVal;
      filterTo.node.innerText = rightVal;
    });

    this.slider.noUiSlider?.on('change', () => {
      updateQueryInURL(this.sliderValues.join('↕'), filterListName, this.paramsList);
      this.paramsList = new URL(window.location.href).searchParams.getAll(filterListName)[0];
      this.onSlider();
      (app.mainContent as ProductsPage).fixLastItemsDisplay();
    });
  }
}
