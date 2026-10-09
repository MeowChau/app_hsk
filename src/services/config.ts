import { Platform } from 'react-native';

/**
 * Intelligent Base URL resolver:
 * - Uses process.env.API_URL if defined (inlined via inline-dotenv)
 * - Android Emulator: 10.0.2.2 points to host machine localhost
 * - iOS Simulator / Web: localhost points to host machine
 * - Physical Device: can configure your LAN IP (e.g. 172.16.9.0)
 */

const resolveApiBaseUrl = (): string => {
  const envUrl = process.env.API_URL;
  if (
    envUrl &&
    envUrl.trim().length > 0 &&
    !envUrl.includes('jsonplaceholder') &&
    !envUrl.includes('10.0.2.2') &&
    !envUrl.includes('192.168.1.8')
  ) {
    // Ensure no trailing slash for consistency
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://192.168.1.7:3001/api/v1';
};

export const API_BASE_URL = resolveApiBaseUrl();

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeoutMs: 15000,
  retryCount: 1,
} as const;
