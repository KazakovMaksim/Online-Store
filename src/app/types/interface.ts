import { Component } from '../components/component';
import { App } from '../core/app';

export interface IRoute {
  name: string;
  component: (id?: number, app?: App) => Component;
}

export type Selector = 'category' | 'brand';

export interface Product {
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

export interface CartItem {
  id: number;
  cost: number;
  quantity: number;
}

export type ProductKeys = keyof Product;
