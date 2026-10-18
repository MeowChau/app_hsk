import ky from 'ky';
import { API_CONFIG } from './config';
import {
  getToken,
  getRefreshToken,
  getAuthSessionVersion,
  saveAuthSession,
  clearAuthSession,
} from './storage';

const prefixUrl = API_CONFIG.baseUrl + '/';
const AUTH_SESSION_CONTEXT_KEY = 'hsk.authSessionVersion';
let refreshOperation: {
  version: number;
  promise: Promise<string | null>;
} | null = null;

const isPublicAuth = (url: string) =>
  [
    'auth/email/login',
    'auth/email/register',
    'auth/forgot/password',
    'auth/reset/password',
    'auth/refresh',
  ].some((route) => url.split('?')[0] === prefixUrl + route);

const refreshSession = async (version: number): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    if (version === getAuthSessionVersion()) clearAuthSession();
    return null;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
  try {
    const response = await fetch(prefixUrl + 'auth/refresh', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: 'Bearer ' + refreshToken,
        Accept: 'application/json',
      },
    });
    if (version !== getAuthSessionVersion()) return null;
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) clearAuthSession();
      return null;
    }
    const session = await response.json();
    if (version !== getAuthSessionVersion()) return null;
    if (typeof session?.token !== 'string' || !session.token) {
      clearAuthSession();
      return null;
    }
    saveAuthSession({
      token: session.token,
      refreshToken: session.refreshToken,
      tokenExpires: session.tokenExpires,
    });
    return session.token;
  } catch {
    // A temporary connection failure must not sign the user out.
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export const instance = ky.extend({
  prefixUrl,
  timeout: API_CONFIG.timeoutMs,
  retry: { limit: API_CONFIG.retryCount, methods: ['get'] },
  headers: { Accept: 'application/json' },
  hooks: {
    beforeRequest: [
      (request, options) => {
        // Ky clones Request before afterResponse; context survives that clone.
        options.context[AUTH_SESSION_CONTEXT_KEY] ??= getAuthSessionVersion();
        if (options.context[AUTH_SESSION_CONTEXT_KEY] !== getAuthSessionVersion()) {
          throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại.');
        }
        const token = getToken();
        if (
          token &&
          !isPublicAuth(request.url) &&
          !request.headers.has('Authorization')
        ) {
          request.headers.set('Authorization', 'Bearer ' + token);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401 || isPublicAuth(request.url))
          return response;
        const token = getToken();
        const version = options.context[AUTH_SESSION_CONTEXT_KEY];
        if (
          !token ||
          typeof version !== 'number' ||
          version !== getAuthSessionVersion()
        )
          return response;
        const originalToken = request.headers.get('Authorization');
        if (!originalToken) return response;
        let newToken: string | null = token;
        if (originalToken === 'Bearer ' + token) {
          if (!refreshOperation || refreshOperation.version !== version) {
            const operation = { version, promise: refreshSession(version) };
            refreshOperation = operation;
            void operation.promise.finally(() => {
              if (refreshOperation === operation) refreshOperation = null;
            });
          }
          newToken = await refreshOperation.promise;
        }
        if (!newToken || version !== getAuthSessionVersion()) return response;
        request.headers.set('Authorization', 'Bearer ' + newToken);
        const retry = await ky(request, {
          timeout: API_CONFIG.timeoutMs,
          retry: 0,
          throwHttpErrors: false,
        });
        if (retry.status === 401 && version === getAuthSessionVersion())
          clearAuthSession();
        return retry;
      },
    ],
  },
});
