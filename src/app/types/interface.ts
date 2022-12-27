import { Component } from '../components/component';

export interface IRoute {
  name: string;
  component: (id?: number) => Component;
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

export type ProductKeys = keyof Product;
