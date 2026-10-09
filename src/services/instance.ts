import ky from 'ky';
import { API_CONFIG } from './config';
import { getToken } from './storage';

const prefixUrl = `${API_CONFIG.baseUrl.replace(/\/+$/, '')}/`;

export const instance = ky.extend({
  prefixUrl,
  timeout: API_CONFIG.timeoutMs,
  headers: {
    Accept: 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();
        if (token && !request.headers.has('Authorization')) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
