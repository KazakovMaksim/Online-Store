import { Href } from '../constants/router-refs';
import { Component } from '../components/component';
import { IRoute } from '../types/interface';
import { MainPage } from '../components/Main/main';

export const routing: IRoute[] = [
  {
    name: Href.CART,
    component: (): Component => new Component(null),
  },
  {
    name: Href.PRODUCTS,
    component: (): Component => new Component(null),
  },
];

export const defaultRoute: IRoute = {
  name: Href.HOME,
  component: () => new MainPage(document.body),
};
