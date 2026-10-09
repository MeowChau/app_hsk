import { createMMKV } from 'react-native-mmkv';

export const authStorage = createMMKV({ id: 'auth-storage' });

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.access_token',
  REFRESH_TOKEN: 'auth.refresh_token',
  TOKEN_EXPIRES: 'auth.token_expires',
  USER: 'auth.user',
} as const;

export const getToken = (): string | null => {
  return authStorage.getString(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ?? null;
};

export const getRefreshToken = (): string | null => {
  return authStorage.getString(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ?? null;
};

export const getTokenExpires = (): number | null => {
  const expires = authStorage.getNumber(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
  return typeof expires === 'number' ? expires : null;
};

export const getUser = <T = unknown>(): T | null => {
  const raw = authStorage.getString(AUTH_STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const saveAuthSession = (session: {
  token: string;
  refreshToken?: string;
  tokenExpires?: number;
  user?: unknown;
}): void => {
  authStorage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, session.token);

  if (session.refreshToken) {
    authStorage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken);
  }
  if (session.tokenExpires) {
    authStorage.set(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, session.tokenExpires);
  }
  if (session.user) {
    authStorage.set(AUTH_STORAGE_KEYS.USER, JSON.stringify(session.user));
  }
};

export const saveUser = (user: unknown): void => {
  authStorage.set(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuthSession = (): void => {
  authStorage.remove(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  authStorage.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  authStorage.remove(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
  authStorage.remove(AUTH_STORAGE_KEYS.USER);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return Boolean(token && token.length > 0);
};
