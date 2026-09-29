export type PaginationInfo = {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
};

export type PaginatedResult<T> = {
  info: PaginationInfo;
  results: T[];
};
