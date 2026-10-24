// File: frontend/src/services/api.service.ts
// Frontend service module for API or client operations.

import axios, { AxiosInstance } from 'axios';
import logger from '@/utils/logger';
import * as storage from '@/utils/storage';
import { getApiBaseUrl } from '@/utils/api-config';

const API_BASE = getApiBaseUrl();
const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'userId';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        config.headers = config.headers || {};

        if (!config.headers.Authorization) {
            const token = await storage.load(TOKEN_KEY);
            if (token && typeof token === 'string') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Exported function setAuthToken.
export function setAuthToken(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

async function handleTokenRefresh(): Promise<string | null> {
    const refreshToken = await storage.load(REFRESH_KEY);
    const uidStr = await storage.load(USER_KEY);
    if (!refreshToken || !uidStr) return null;
    const userId = String(uidStr);

    try {
        const cleanApi = axios.create({
            baseURL: API_BASE,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await cleanApi.post<{ token: string }>('/auth/refresh-token', {
            userId,
            refreshToken,
        });
        const newToken = res.data.token;
        setAuthToken(newToken);
        await storage.save(TOKEN_KEY, newToken);
        return newToken;
    } catch (e) {
        return null;
    }
}

// Cleanup auth state & navigate to login
async function handleLogout() {
    logger.warn('[API] Forcing session cleanup due to 401');
    await storage.remove(TOKEN_KEY);
    await storage.remove(REFRESH_KEY);
    await storage.remove(USER_KEY);
}

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config as (typeof err.config & { __isRetry?: boolean }) | undefined;

        if (err.response?.status === 401 && originalRequest) {
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                logger.warn(`[API] Clearing auth state after refresh-token failure: ${originalRequest.url}`);
                await storage.remove('accessToken');
                await storage.remove('refreshToken');
                await storage.remove('userId');
                return Promise.reject(err);
            }

            if (!originalRequest.__isRetry) {
                logger.warn(`[API] Attempting token refresh after 401 from: ${originalRequest.url}`);
                const newToken = await handleTokenRefresh();

                if (newToken) {
                    originalRequest.__isRetry = true;
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            }

            await handleLogout();
        }

        return Promise.reject(err);
    }
);

// Default export for this module.
export default api;
