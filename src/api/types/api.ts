export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  q?: string;
  [key: string]: string | number | boolean | undefined;
}

export type ApiErrorKind =
  | 'validation'
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly kind: ApiErrorKind;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { statusCode?: number; kind?: ApiErrorKind; details?: unknown } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options.statusCode;
    this.kind = options.kind ?? 'unknown';
    this.details = options.details;
  }
}

export const EMPTY_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};
