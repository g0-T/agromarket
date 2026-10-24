// File: frontend/src/hooks/use-app-theme.ts
// Custom hook logic for React state and side effects.

import { useMemo, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/constants/theme';
import { AppThemeContext } from '@/context/AppThemeContext';

type GetStylesFunc<T> = (colors: ReturnType<typeof getThemeColors>) => T;
type ThemeMode = 'light' | 'dark';

// Exported function useAppTheme.
export function useAppTheme<T = any>(getStyles?: GetStylesFunc<T>) {
  const context = useContext(AppThemeContext);
  const colorScheme = useColorScheme();
  const theme: ThemeMode = context?.theme ?? (colorScheme === 'dark' ? 'dark' : 'light');
  const isDark = context?.isDark ?? theme === 'dark';

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);

  const styles = useMemo(() => {
    if (getStyles) {
      return getStyles(colors);
    }
    return {} as T;
  }, [getStyles, colors]);

  return {
    theme,
    isDark,
    colors,
    styles,
    setTheme: context?.setTheme,
    toggleTheme: context?.toggleTheme,
  };
}
