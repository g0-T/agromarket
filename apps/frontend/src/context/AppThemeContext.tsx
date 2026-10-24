// File: frontend/src/context/AppThemeContext.tsx
// React context provider or consumer definitions.

import React, { useState, useEffect, useCallback } from 'react';
import { useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeColors } from '@/constants/theme';
import logger from '@/utils/logger';

type GetStylesFunc<T> = (colors: ReturnType<typeof getThemeColors>) => T;

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'appThemeMode';

interface AppThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (value: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

// React context provider or hook for appTheme.
export const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

// Provider component that supplies context or state.
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const defaultTheme: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setThemeState(storedTheme);
        } else if (systemColorScheme) {
          setThemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        logger.warn('Error loading theme preference', { error });
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const setTheme = useCallback(async (value: ThemeMode) => {
    try {
      setThemeState(value);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
      if (Platform.OS === 'web') {
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      logger.warn('Error saving theme preference', { error });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const isDark = theme === 'dark';

  const toggleTheme = useCallback(async () => {
    await setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  return (
    <AppThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}