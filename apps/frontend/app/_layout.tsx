import { useState, useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useRef } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/use-auth';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { AppThemeProvider } from '@/context/AppThemeContext';
import { getStyles } from '@/styles/screens/auth/auth.styles';
import ErrorBoundary from '@/errors/ErrorBoundary';
import { initSentry } from '@/utils/sentry';
import { Platform, View, ActivityIndicator } from 'react-native';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import logger from '@/utils/logger';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
}

SplashScreen.preventAutoHideAsync().catch(() => { });

function RootLayoutNav() {
  const { user, isReady } = useAuth();
  const { colors } = useTheme(getStyles);
  const segments = useSegments();
  const router = useRouter();
  const isNavigating = useRef(false);

  usePushNotifications();

  useEffect(() => {
    isNavigating.current = false;
  }, [segments]);

  useEffect(() => {
    if (!isReady || !segments || isNavigating.current) return;

    const segmentsPath = segments.map(s => String(s).toLowerCase());

    const currentPath = `/${segmentsPath.filter(p => !p.startsWith('(') && p !== 'index').join('/')}`.replace(/\/+$/, '') || '/';

    const isAtAuthGroup = segmentsPath.some(s => s.includes('auth') || s.includes('login') || s.includes('verify-otp'));
    const isAtVerify = segmentsPath.includes('verify-otp');
    const userIsVerified = !!user?.emailVerified;

    logger.debug(`[ROOT-GUARD] Path: ${currentPath} | InTabs: ${segments[0] === '(tabs)'}`);

    if (user && segments[0] === '(tabs)' && !!user?.emailVerified && user.role !== 'admin') {
      logger.debug('RootLayout yields control to TabsLayout for non-admin user.');
      return;
    }

    logger.debug(`[NAV-CHECK] Current: ${currentPath} | User: ${!!user} | Ready: ${isReady}`);

    // FUNCIÓN AUXILIAR PARA NAVEGAR SIN BUCLES
    const safeReplace = (target: string | { pathname: string, params: any }) => {
      const targetStr = typeof target === 'string' ? target : target.pathname;

      const isGoingToHome = targetStr === '/(tabs)' || targetStr === '/';
      const isAtHome = currentPath === '/' || currentPath === '' || currentPath === '/index';

      if (isGoingToHome && isAtHome) {
        logger.debug('Already at Home, cancelling redundant redirect.');
        return;
      }

      if (currentPath === targetStr) return;

      logger.debug(`Navigating from ${currentPath} to ${targetStr}`);
      isNavigating.current = true;
      router.replace(target);
    };

    if (!user) {
      if (!isAtAuthGroup) {
        safeReplace('/(auth)/login');
      }
      return;
    }

    if (!userIsVerified) {
      if (!isAtVerify) {
        safeReplace({ pathname: '/(auth)/verify-otp', params: { email: user.email } });
      }
      return;
    }

    const isAtAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');

    if (isAtAuthGroup) {
      const destination = user.role === 'admin' ? '/admin' : '/(tabs)';
      safeReplace(destination);
      return;
    }

    if (user.role === 'admin' && !isAtAdminRoute) {
      safeReplace('/admin');
      return;
    }

    if (user.role !== 'admin' && isAtAdminRoute) {
      safeReplace('/(tabs)');
      return;
    }

  }, [user?.id, user?.emailVerified, isReady, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <Slot />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <AppThemeProvider>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
        </AppThemeProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}