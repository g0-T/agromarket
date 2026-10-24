// File: frontend/src/styles/shadows.ts
// Style definitions for frontend components and screens.

import { Platform } from 'react-native';

// Exported constant getPersonalDataCardShadow.
export const getPersonalDataCardShadow = (isDark: boolean) =>
    Platform.select({
        ios: {
            shadowColor: isDark ? '#000' : '#1a2e17',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.28 : 0.08,
            shadowRadius: 18,
        },
        android: { elevation: 5 },
        web: {
            boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.38)'
                : '0 4px 24px rgba(26,46,23,0.08)',
        } as any,
    }) as any;

// Exported constant getPersonalDataElevatedShadow.
export const getPersonalDataElevatedShadow = (isDark: boolean) =>
    Platform.select({
        ios: {
            shadowColor: isDark ? '#000' : '#1a2e17',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: isDark ? 0.45 : 0.13,
            shadowRadius: 26,
        },
        android: { elevation: 10 },
        web: {
            boxShadow: isDark
                ? '0 10px 36px rgba(0,0,0,0.5)'
                : '0 10px 36px rgba(26,46,23,0.12)',
        } as any,
    }) as any;
