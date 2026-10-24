// File: frontend/src/utils/api-config.ts
// Shared API configuration for consistent URL handling across the app.

import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getExpoApiUrl(): string | undefined {
  return (Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.apiUrl as string | undefined;
}

function getRuntimeHost(): string | undefined {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.hostUri || ''; 
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }

  return undefined;
}

function resolveApiUrl(): string {
  const envUrl = (getExpoApiUrl() || (process.env as any).EXPO_PUBLIC_API_URL || '').trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  const host = getRuntimeHost() || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
  const protocol = Platform.OS === 'web' ? 'http' : 'http';
  return `${protocol}://${host}:5000/api`;
}

/**
 * Get the base API URL based on environment
 * @returns The API base URL
 */
export function getApiBaseUrl(): string {
  return resolveApiUrl();
}

/**
 * Get the socket URL based on environment
 * @returns The socket URL (without /api suffix)
 */
export const API_BASE_URL = getApiBaseUrl();

export function getSocketUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

export const SOCKET_URL = getSocketUrl();
