// File: frontend/src/services/auth.service.ts
// Frontend service module for API or client operations.

import api, { setAuthToken } from '@/services/api.service';
import * as storage from '@/utils/storage';
import { emitLogout } from '@/utils/auth-events';
import logger from '@/utils/logger';

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'userId';

const isWeb = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const authStorage = {
    async save(key: string, value: string) {
        if (isWeb) {
            window.sessionStorage.setItem(key, value);
            return;
        }
        await storage.save(key, value);
    },
    async load(key: string) {
        if (isWeb) {
            return window.sessionStorage.getItem(key);
        }
        return await storage.load(key);
    },
    async remove(key: string) {
        if (isWeb) {
            window.sessionStorage.removeItem(key);
            return;
        }
        await storage.remove(key);
    },
};

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

interface RegisterResponse {
    token: string;
    refreshToken: string;
    refreshExpiresAt: string;
    user: {
        id: string;
        name: string;
        role: 'buyer' | 'seller';
        image?: string | null;
    };
}

interface LoginResponse extends RegisterResponse { }

let _token: string | null = null;
let _refresh: string | null = null;
let _userId: string | null = null;

async function persist() {
    if (_token) await authStorage.save(TOKEN_KEY, _token);
    if (_refresh) await authStorage.save(REFRESH_KEY, _refresh);
    if (_userId !== null) await authStorage.save(USER_KEY, String(_userId));
}

async function clearStorage() {
    await authStorage.remove(TOKEN_KEY);
    await authStorage.remove(REFRESH_KEY);
    await authStorage.remove(USER_KEY);
}

const authService = {
    login: async (creds: LoginRequest): Promise<LoginResponse | { requiresVerification: true }> => {
        const normalizedEmail = creds.email.trim().toLowerCase();
        logger.info(`[FRONTEND LOGIN] Attempting login for ${normalizedEmail}`);

        const res = await api.post('/auth/sign-in/email', {
            email: normalizedEmail,
            password: creds.password
        });
        logger.debug('[FRONTEND LOGIN] sign-in/email response:', res.data);

        const responseData = res.data || {};
        const sessionData = (responseData as any).session || {};
        const userData = responseData.user || sessionData.user;

        const token = responseData.token || sessionData.token;
        const refreshToken = responseData.refreshToken || sessionData.refreshToken;
        const userId = userData?.id || sessionData?.user?.id;

        logger.debug(`[FRONTEND LOGIN] Tokens extracted: token=${!!token}, refresh=${!!refreshToken}, userId=${userId}, requiresVerification=${responseData.requiresVerification}`);

        _token = token || null;
        _refresh = refreshToken || null;
        _userId = userId ? String(userId) : null;

        setAuthToken(_token);
        await persist();

        return res.data;
    },

    register: async (creds: RegisterRequest): Promise<any> => {
        await authService.logout();
        const normalizedEmail = creds.email.trim().toLowerCase();
        logger.info(`[FRONTEND REGISTER] Registering user ${normalizedEmail}`);

        const res = await api.post('/auth/sign-up/email', {
            email: normalizedEmail,
            password: creds.password,
            name: creds.name,
            phone: creds.phone,
        });
        logger.debug('[FRONTEND REGISTER] sign-up/email response:', res.data);

        const responseData = res.data || {};
        const sessionData = (responseData as any).session || {};
        const token = responseData.token || sessionData.token;
        const refreshToken = responseData.refreshToken || sessionData.refreshToken;
        const userId = responseData.user?.id || sessionData.user?.id;

        logger.debug(`[FRONTEND REGISTER] Tokens extracted: token=${!!token}, refresh=${!!refreshToken}, userId=${userId}`);

        if (token) {
            _token = token;
            setAuthToken(token);
            logger.debug('[FRONTEND REGISTER] Token set');
        }
        if (refreshToken) {
            _refresh = refreshToken;
            logger.debug('[FRONTEND REGISTER] Refresh token set');
        }
        if (userId) {
            _userId = String(userId);
            logger.debug(`[FRONTEND REGISTER] UserId set: ${userId}`);
        }

        await persist();
        logger.debug('[FRONTEND REGISTER] Data persisted');
        return responseData;
    },

    sendEmailVerificationOtp: async (email: string): Promise<any> => {
        const normalizedEmail = email.trim().toLowerCase();
        return api.post('/auth/email-otp/send-verification-otp', {
            email: normalizedEmail,
            type: 'email-verification',
        });
    },

    verifyOtp: async (email: string, otp: string): Promise<any> => {
        const normalizedEmail = email.trim().toLowerCase();
        logger.info(`[FRONTEND OTP] Verifying OTP for ${normalizedEmail} with code ${otp}`);
        const res = await api.post('/auth/email-otp/verify-email', {
            email: normalizedEmail,
            otp,
        });
        logger.debug('[FRONTEND OTP] verify-email response:', res.data);

        const responseData = res.data || {};

        const newToken = responseData.token || responseData.session?.token;
        const newRefreshToken = responseData.refreshToken || responseData.session?.refreshToken;
        const userId = responseData.user?.id || responseData.session?.user?.id;

        logger.debug(`[FRONTEND OTP] New tokens extracted: token=${!!newToken}, refresh=${!!newRefreshToken}, userId=${userId}`);

        if (newToken) {
            _token = newToken;
            setAuthToken(newToken);
            logger.debug('[FRONTEND OTP] Token updated');
        }

        if (newRefreshToken) {
            _refresh = newRefreshToken;
            logger.debug('[FRONTEND OTP] Refresh token updated');
        }

        if (userId) {
            _userId = String(userId);
            logger.debug(`[FRONTEND OTP] UserId updated: ${userId}`);
        }

        await persist();
        logger.debug('[FRONTEND OTP] Data persisted');

        return res.data;
    },

    sendPhoneOtp: async (phone: string): Promise<any> => {
        const res = await api.post('/auth/phone/send-otp', { phone });
        return res.data;
    },

    verifyPhoneOtp: async (phone: string, otp: string): Promise<any> => {
        const res = await api.post('/auth/phone/verify-otp', { phone, otp });
        return res.data;
    },

    logout: async () => {
        _token = null;
        _refresh = null;
        _userId = null;
        setAuthToken(null);
        await clearStorage();
        emitLogout();
    },

    setToken: (token: string | null) => {
        _token = token;
        setAuthToken(token);
    },

    getToken: () => _token,

    getRefresh: () => _refresh,

    getUserId: () => _userId,

    refresh: async (): Promise<string | null> => {
        if (!_refresh || _userId === null) return null;
        try {
            const res = await api.post<{ token: string }>('/auth/refresh-token', {
                userId: _userId,
                refreshToken: _refresh,
            });
            const newToken = res.data.token;
            _token = newToken;
            setAuthToken(newToken);
            await authStorage.save(TOKEN_KEY, newToken);
            return newToken;
        } catch (e) {
            await authService.logout();
            return null;
        }
    },

    init: async () => {
        const token = await authStorage.load(TOKEN_KEY);
        const refresh = await authStorage.load(REFRESH_KEY);
        const uid = await authStorage.load(USER_KEY);
        if (token) {
            _token = token;
            setAuthToken(token);
        }
        if (refresh) _refresh = refresh;
        if (uid) _userId = String(uid);
    },
};

// Default export for this module.
export default authService;
