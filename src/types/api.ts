/** `{ data, meta }` page returned by every paginated API list. */
export interface ApiPage<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
