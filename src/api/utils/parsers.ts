export interface Pagination {
  offset: number;
  first: number;
}

export type Paginable = Partial<Pagination>;

export function pagination(page: Paginable): Pagination {
  return {
    offset: Math.max(page.offset || 0, 0),
    first: Math.min(page.first || config.QUERY_LIMIT, config.QUERY_LIMIT),
  };
}
