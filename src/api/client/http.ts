import {
  ApiError,
  EMPTY_META,
  type ApiEnvelope,
  type PaginatedResult,
  type PaginationMeta,
  type PaginationParams,
} from '../types/api';

const DEFAULT_API_URL = 'http://localhost:3000';
const REQUEST_TIMEOUT = 15_000;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: PaginationParams;
  body?: unknown;
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob';
}

function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_URL;
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

export const API_BASE_URL = resolveBaseUrl();

function buildUrl(path: string, params?: PaginationParams): string {
  const url = new URL(
    path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function readValidationMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const body = payload as { message?: unknown };
  if (typeof body.message === 'string') return body.message;
  if (Array.isArray(body.message)) {
    return body.message.filter((item): item is string => typeof item === 'string').join(' ');
  }
  return undefined;
}

function toApiErrorFromStatus(status: number, payload: unknown, fallback?: string): ApiError {
  const message = readValidationMessage(payload) || fallback;
  if (status === 400) {
    return new ApiError(message || 'Les données envoyées sont invalides.', {
      statusCode: status,
      kind: 'validation',
      details: payload,
    });
  }
  if (status === 401) {
    return new ApiError('Votre session a expiré. Veuillez vous reconnecter.', {
      statusCode: status,
      kind: 'unauthorized',
    });
  }
  if (status === 403) {
    return new ApiError("Vous n'avez pas les droits nécessaires pour cette action.", {
      statusCode: status,
      kind: 'forbidden',
    });
  }
  if (status === 404) {
    return new ApiError(message || 'Ressource introuvable.', {
      statusCode: status,
      kind: 'not_found',
    });
  }
  if (status === 409) {
    // Doublon détecté par le backend : le message est explicite et destiné
    // à l'utilisateur, on le transmet sans le remplacer.
    return new ApiError(message || 'Cette valeur est déjà utilisée.', {
      statusCode: status,
      kind: 'conflict',
    });
  }
  if (status === 502 || status === 503) {
    return new ApiError(message || 'Une erreur serveur est survenue. Réessayez plus tard.', {
      statusCode: status,
      kind: 'server',
      details: payload,
    });
  }
  if (status >= 500) {
    return new ApiError(message || 'Une erreur serveur est survenue. Réessayez plus tard.', {
      statusCode: status,
      kind: 'server',
    });
  }
  return new ApiError(message || 'Une erreur inattendue est survenue.', {
    statusCode: status,
    kind: 'unknown',
    details: payload,
  });
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('La requête a expiré. Veuillez réessayer.', { kind: 'timeout' });
  }
  if (error instanceof TypeError) {
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return new ApiError(
      offline
        ? 'Vous êtes hors ligne. Vérifiez votre connexion Internet avant de réessayer.'
        : 'Le serveur est inaccessible. Vérifiez votre connexion.',
      { kind: 'network' }
    );
  }
  return new ApiError('Une erreur inattendue est survenue.', { kind: 'unknown' });
}

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === 'object' && 'statusCode' in payload && 'data' in payload) {
    return ((payload as ApiEnvelope<T>).data ?? null) as T;
  }
  return payload as T;
}

function unwrapMeta(payload: unknown): PaginationMeta | undefined {
  if (payload && typeof payload === 'object' && 'meta' in payload) {
    return (payload as ApiEnvelope<unknown>).meta;
  }
  return undefined;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<{ data: T; meta?: PaginationMeta; message?: string }> {
  const controller = new AbortController();
  const timeout = options.timeout ?? REQUEST_TIMEOUT;
  const timer = setTimeout(() => controller.abort(), timeout);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(buildUrl(url, options.params), {
      method: options.method ?? 'GET',
      headers,
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await parseJsonSafe(response);
      throw toApiErrorFromStatus(response.status, payload);
    }

    const envelope = (await parseJsonSafe(response)) as ApiEnvelope<T> | T;
    return {
      data: unwrap<T>(envelope),
      meta: unwrapMeta(envelope),
      message:
        envelope && typeof envelope === 'object' && 'message' in envelope
          ? (envelope as ApiEnvelope<T>).message
          : undefined,
    };
  } catch (error) {
    throw toApiError(error);
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  async get<T>(url: string, params?: PaginationParams, signal?: AbortSignal): Promise<T> {
    const { data } = await request<T>(url, { method: 'GET', params, signal });
    return data;
  },

  async getList<T>(
    url: string,
    params?: PaginationParams,
    signal?: AbortSignal
  ): Promise<PaginatedResult<T>> {
    const result = await request<T[]>(url, { method: 'GET', params, signal });
    const items = Array.isArray(result.data) ? result.data : [];
    return {
      data: items,
      meta: result.meta ?? {
        ...EMPTY_META,
        total: items.length,
        limit: params?.limit ?? items.length,
        page: params?.page ?? 1,
        totalPages: 1,
      },
      message: result.message ?? '',
      statusCode: 200,
    };
  },

  async post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await request<T>(url, { method: 'POST', body });
    return data;
  },

  async put<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await request<T>(url, { method: 'PUT', body });
    return data;
  },

  async patch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await request<T>(url, { method: 'PATCH', body });
    return data;
  },

  async delete(url: string): Promise<void> {
    await request<null>(url, { method: 'DELETE' });
  },
};

export default apiClient;
