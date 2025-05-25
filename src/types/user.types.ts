export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    links: PaginationLinks;
  } | null;
}
