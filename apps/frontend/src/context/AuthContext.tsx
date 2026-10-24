// File: frontend/src/context/AuthContext.tsx
// React context provider or consumer definitions.

import React, { createContext, useState, useEffect } from 'react';
import authService from '@/services/auth.service';
import { onLogout } from '@/utils/auth-events';
import { useUserStore } from '@/store/use-user.store';
import { useDashboardStore } from '@/store/use-dashboard.store';
import logger from '@/utils/logger';
import { getApiBaseUrl } from '@/utils/api-config';

const API_BASE = getApiBaseUrl();

// Type declaration User.
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  image?: string | null;
  emailVerified: boolean | null;
  phone: string | null;
  phoneVerified?: Date | null;
}

// Type declaration AuthContextType.
export interface AuthContextType {
  user: User | null;
  isReady: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signUp: (credentials: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isReady: false,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
  refreshUser: async () => null,
  updateUser: () => { },
});

// Provider component that supplies context or state.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { setUser: setStoreUser } = useUserStore();

  const setUserAndStore = (newUser: User | null) => {
    logger.debug('[CONTEXT] Updating global user:', newUser?.email);
    setUser(newUser);
    setStoreUser(newUser);
  };

  const normalizeEmailVerified = (value: any): boolean | null => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
  };

  // Change signature to accept an optional token
  const refreshUser = async (manualToken?: string): Promise<User | null> => {
    logger.debug('[FRONTEND AUTH CONTEXT] Starting refreshUser');
    try {
      const token = manualToken || authService.getToken();
      logger.debug(`[FRONTEND AUTH CONTEXT] Token available: ${!!token}`);

      if (!token) {
        logger.debug('[FRONTEND AUTH CONTEXT] No token found, setting null');
        setUserAndStore(null);
        return null;
      }

      const response = await fetch(`${API_BASE}/auth/get-session`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      logger.debug('[DEBUG] get-session response body:', data);

      if (response.ok) {
        const userData = data?.user || data?.session?.user;

        if (!userData) {
          logger.warn('[AuthContext] Server did not return user data', data);
          setUserAndStore(null);
          return null;
        }

        const normalizedUser: User = {
          id: userData.id?.toString() || '',
          name: userData.name || null,
          email: userData.email || '',
          role: userData.role || 'buyer',
          image: userData.image || null,
          emailVerified: normalizeEmailVerified(userData.emailVerified),
          phone: userData.phone || null,
          phoneVerified: userData.phoneVerified || null,
        };

        setUserAndStore(normalizedUser);
        return normalizedUser;
      }

      if (response.status === 401 || response.status === 403) {
        await authService.logout();
        setUserAndStore(null);
      }
      return null;
    } catch (error) {
      logger.error('[AuthContext] Fatal error in refreshUser:', { error });
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await authService.init();
        await refreshUser();
      } catch (error) {
        logger.error(error, { context: 'AuthProvider.init' });
      } finally {
        setIsReady(true);
      }
    };
    init();

    const unsubscribe = onLogout(() => setUserAndStore(null));
    return unsubscribe;
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    const result = await authService.login(credentials);

    if (result && 'requiresVerification' in result) {
      return result;
    }

    const loginData = result as any;
    const userData = loginData?.user || loginData?.session?.user;

    if (userData) {
      setUserAndStore({
        id: userData.id.toString(),
        name: userData.name || null,
        email: userData.email || '',
        role: userData.role || 'buyer',
        image: userData.image || null,
        emailVerified: normalizeEmailVerified(userData.emailVerified),
        phone: userData.phone || null,
        phoneVerified: userData.phoneVerified || null,
      });
    } else {
      await refreshUser();
    }

    return result;
  };

  const signUp = async (credentials: { name: string; email: string; password: string; phone?: string }) => {
    await authService.register(credentials);
  };

  const signOut = async () => {
    await authService.logout();
    setUserAndStore(null);
    useDashboardStore.getState().reset();
  };

  return (
    <AuthContext.Provider value={{ user, isReady, signIn, signUp, signOut, refreshUser, updateUser: setUserAndStore }}>
      {children}
    </AuthContext.Provider>
  );
}

// Default export for this module.
export default AuthContext;