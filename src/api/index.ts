// Point d'entrée unique des exports du répertoire "api".
export { API_BASE_URL, apiClient } from './client/http';
export type { RequestOptions } from './client/http';
export { endpoints } from './endpoints';
export { ApiError, EMPTY_META } from './types/api';
export type {
  PaginationMeta,
  ApiEnvelope,
  PaginatedResult,
  PaginationParams,
  ApiErrorKind,
} from './types/api';
