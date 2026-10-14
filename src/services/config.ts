import { NativeModules, Platform } from 'react-native';

/**
 * Local Android development uses adb reverse, so changing Wi-Fi does not change the API URL.
 * A LAN API address follows Metro's host in development; public/release URLs stay explicit.
 */

const resolveApiBaseUrl = (): string => {
  const envUrl = process.env.API_URL;
  const fallback = Platform.OS === 'android'
    ? 'http://10.0.2.2:3001/api/v1'
    : 'http://localhost:3001/api/v1';
  let api: URL;
  try {
    api = new URL(envUrl?.trim() || fallback);
    if (api.protocol !== 'http:' && api.protocol !== 'https:') api = new URL(fallback);
  } catch {
    api = new URL(fallback);
  }
  const loopback = (host: string) => /^(localhost|127\.\d+\.\d+\.\d+|\[?::1\]?)$/i.test(host);
  const localHost = (host: string) => loopback(host) ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(host) || host.endsWith('.local');

  if (__DEV__ && localHost(api.hostname)) {
    // An explicit Android loopback URL selects USB forwarding configured by the start/android scripts.
    if (!(Platform.OS === 'android' && loopback(api.hostname))) {
      try {
        const source = NativeModules.SourceCode;
        const scriptUrl = source?.getConstants?.().scriptURL ?? source?.scriptURL;
        if (typeof scriptUrl === 'string' && /^https?:\/\//i.test(scriptUrl)) {
          const host = new URL(scriptUrl).hostname;
          api = new URL(`${api.protocol}//${host}${api.port ? `:${api.port}` : ''}${api.pathname}${api.search}${api.hash}`);
        }
      } catch {
        // A bundled/offline app can still use its configured URL.
      }
    }
  }
  return api.toString().replace(/\/+$/, '');
};

export const API_BASE_URL = resolveApiBaseUrl();
export const API_ORIGIN = new URL(API_BASE_URL).origin;

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeoutMs: 15000,
  retryCount: 1,
} as const;
