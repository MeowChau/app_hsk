import type { ImageSourcePropType } from 'react-native';
import { API_BASE_URL, API_ORIGIN } from './config';

export const resolveMediaUrl = (value?: string | null): string | undefined => {
  if (!value?.trim()) return undefined;
  const normalized = value.trim().replace(/\\/g, '/');
  if (/^https?:/i.test(normalized)) {
    const media = new URL(normalized);
    const localHost =
      /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(
        media.hostname,
      );
    const apiPath = new URL(API_BASE_URL).pathname.replace(/\/$/, '');
    // Local uploads can contain the backend's old LAN origin; use the app's configured server.
    if (localHost && media.pathname.startsWith(`${apiPath}/files/`)) {
      return `${API_ORIGIN}${media.pathname}${media.search}`;
    }
    return normalized;
  }
  if (/^(data:|file:|content:)/i.test(normalized)) return normalized;
  if (normalized.startsWith('//'))
    return `${new URL(API_ORIGIN).protocol}${normalized}`;
  if (normalized.startsWith('/')) return `${API_ORIGIN}${normalized}`;
  return `${API_BASE_URL}/${normalized.replace(/^\/+/, '')}`;
};

export const imageSource = (
  value: string | ImageSourcePropType | null | undefined,
): ImageSourcePropType | undefined =>
  typeof value === 'string'
    ? { uri: resolveMediaUrl(value) }
    : (value ?? undefined);
