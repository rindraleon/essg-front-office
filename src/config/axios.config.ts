import axios, { type AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

/**
 * Axios configuration
 *
 * - baseURL read from import.meta.env.VITE_API_BASE_URL with fallback
 * - Authorization header read from cookie "pnud_token" at request time
 * - 401 responses clear the cookie and redirect to /login?redirect=...
 * - helpers exported to set/clear token programmatically
 *
 * Notes:
 * - Ensure you have installed js-cookie and its types:
 *     npm install js-cookie
 *     npm install -D @types/js-cookie
 */

/* Base URL (Vite) */
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || 'https://gateway.tsirylab.com';

/* Cookie name used to store the token */
const TOKEN_COOKIE_NAME = 'token_name';

const axiosConfig: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10_000,
});

/* Helper to safely read token (SSR-safe) */
function getToken(): string | undefined {
  // Use globalThis.window comparison (safe and avoids `typeof` Sonar warning)
  if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined')
    return undefined;
  return Cookies.get(TOKEN_COOKIE_NAME);
}

/* Helpers to manage token from JS flows (login/logout) */
export function setAuthToken(token: string, options?: Cookies.CookieAttributes) {
  if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return;
  Cookies.set(TOKEN_COOKIE_NAME, token, { sameSite: 'lax', ...options });
}

export function clearAuthToken() {
  if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return;
  Cookies.remove(TOKEN_COOKIE_NAME);
}

/* Optional handler registration for auth failures (e.g., show a toast) */
let onAuthFailure: (() => void) | null = null;
export function registerAuthFailureHandler(fn: () => void) {
  onAuthFailure = fn;
}

/* Request interceptor: attach Authorization header at request time */
axiosConfig.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      // ensure headers object exists and is mutable
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else if (config.headers) {
      // remove possible stale Authorization header
      delete (config.headers as Record<string, unknown>)['Authorization'];
    }
    return config;
  },
  (error) => {
    // Wrap non-Error rejection reasons to satisfy Sonar rule expecting an Error
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  }
);

/* Response interceptor: handle 401 globally and normalize rejections to Error */
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // token expired or invalid: clear cookie and optionally notify app
      try {
        clearAuthToken();
      } catch {
        // ignore cookie errors
      }

      if (onAuthFailure) {
        try {
          onAuthFailure();
        } catch {
          // ignore handler errors
        }
      }

      if (typeof (globalThis as unknown as { window?: unknown }).window !== 'undefined') {
        const returnTo = `${(globalThis as unknown as { window: { location: { pathname: string; search: string } } }).window.location.pathname}${(globalThis as unknown as { window: { location: { search: string } } }).window.location.search || ''}`;
        const loginUrl = `/login?redirect=${encodeURIComponent(returnTo)}`;
        // Use replace so the failing page isn't kept in history
        (
          globalThis as unknown as { window: { location: { replace: (url: string) => void } } }
        ).window.location.replace(loginUrl);
      }
    }

    const err = error instanceof Error ? error : new Error(JSON.stringify(error));
    return Promise.reject(err);
  }
);

export default axiosConfig;
