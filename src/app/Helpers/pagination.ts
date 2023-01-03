import { CartController } from './cartController';

export class Pagination {
  static setLimit(limit: number) {
    const url = new URL(window.location.hash);
    url.searchParams.set('limit', limit.toString());
    window.location.href = url.href.toString();
  }
}
