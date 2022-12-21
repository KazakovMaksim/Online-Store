import { Component } from '../components/component';
import { ProductDetailsPage } from '../components/ProductDetailsPage/productDetails';

export interface IRoute {
  name: string;
  component: (id?: number) => Component;
}
