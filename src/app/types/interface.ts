import { Component } from '../components/component';

export interface IRoute {
  name: string;
  component: () => Component;
}
