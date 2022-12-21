import { Component } from '../components/component';

export interface IRoute {
  name: string;
  component: () => Component;
}

export type Selector = 'category' | 'brand';

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export type ProductItemKeys = keyof ProductItem;
