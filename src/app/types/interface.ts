import { Component } from '../components/component';

export interface IRoute {
  name: string;
  component: (id?: number) => Component;
}

export interface product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
