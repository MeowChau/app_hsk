import { createMMKV } from 'react-native-mmkv';

export const authStorage = createMMKV({ id: 'auth-storage' });

let sessionVersion = 0;
const sessionListeners = new Set<() => void>();
export const getAuthSessionVersion = () => sessionVersion;
export const subscribeAuthSession = (listener: () => void): (() => void) => {
  sessionListeners.add(listener);
  return () => { sessionListeners.delete(listener); };
};
const notifySessionChange = () => {
  sessionVersion += 1;
  sessionListeners.forEach(listener => listener());
};

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
  if (session.user) {
    authStorage.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    authStorage.remove(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
  }
  authStorage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, session.token);

  if (session.refreshToken) {
    authStorage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken);
  }
  if (session.tokenExpires) {
    authStorage.set(AUTH_STORAGE_KEYS.TOKEN_EXPIRES, session.tokenExpires);
  }
  if (session.user) {
    authStorage.set(AUTH_STORAGE_KEYS.USER, JSON.stringify(session.user));
    notifySessionChange();
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
  notifySessionChange();
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return Boolean(token && token.length > 0);
};

export const APP_STORAGE_KEYS = {
  HAS_COMPLETED_SURVEY: 'app.has_completed_survey',
  SURVEY_DATA: 'app.survey_data',
  SURVEY_PENDING: 'app.survey_pending',
} as const;

export interface SurveyData {
  currentLevel: string;
  targetLevel: string;
  dailyTime: string;
}

type SurveyUserId = number | string;

const surveyStorageKey = (key: string, userId: SurveyUserId): string =>
  `${key}.${userId}`;

export const hasCompletedSurvey = (userId: SurveyUserId): boolean => {
  return (
    authStorage.getBoolean(
      surveyStorageKey(APP_STORAGE_KEYS.HAS_COMPLETED_SURVEY, userId),
    ) ?? false
  );
};

export const setCompletedSurvey = (
  userId: SurveyUserId,
  completed: boolean = true,
): void => {
  authStorage.set(
    surveyStorageKey(APP_STORAGE_KEYS.HAS_COMPLETED_SURVEY, userId),
    completed,
  );
};

export const saveSurveyData = (userId: SurveyUserId, data: SurveyData): void => {
  authStorage.set(
    surveyStorageKey(APP_STORAGE_KEYS.SURVEY_DATA, userId),
    JSON.stringify(data),
  );
};

export const getSurveyData = (userId: SurveyUserId): SurveyData | null => {
  const raw = authStorage.getString(
    surveyStorageKey(APP_STORAGE_KEYS.SURVEY_DATA, userId),
  );
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SurveyData;
  } catch {
    return null;
  }
};

export const hasPendingSurvey = (userId: SurveyUserId): boolean =>
  authStorage.getBoolean(surveyStorageKey(APP_STORAGE_KEYS.SURVEY_PENDING, userId)) ?? false;

export const setPendingSurvey = (userId: SurveyUserId, pending: boolean): void => {
  authStorage.set(surveyStorageKey(APP_STORAGE_KEYS.SURVEY_PENDING, userId), pending);
};
