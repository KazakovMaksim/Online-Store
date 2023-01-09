export class Pagination {
  static setLimit(limit: number): void {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', limit.toString());
    history.pushState(null, '', url);
  }

  static getLimit(): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get('limit');
  }

  static setPage(page: number): void {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    history.pushState(null, '', url);
  }

  static getPage(): number | null {
    const url = new URL(window.location.href);
    return Number(url.searchParams.get('page'));
  }
}
