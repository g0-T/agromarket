// File: frontend/src/hooks/settings/use-settings.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getSettingsStyles } from '@/styles/screens/dashboard/settings.styles';
import AuthContext from '@/context/AuthContext';
import notificationService from '@/services/notification.service';
import logger from '@/utils/logger';

interface SettingsState {
    nombre: string;
    email: string;
    notificacionesPush: boolean;
    notificacionesEmail: boolean;
    darkMode: boolean;
}

// Exported constant useSettings.
export const useSettings = (onBack: () => void) => {
    const { theme, colors, styles, setTheme } = useTheme(getSettingsStyles);
    const router = useRouter();
    const { signOut, user } = useContext(AuthContext);

    const [settings, setSettings] = useState<SettingsState>({
        nombre: '',
        email: '',
        notificacionesPush: true,
        notificacionesEmail: false,
        darkMode: theme === 'dark',
    });

    useEffect(() => {
        setSettings(prev => ({ ...prev, darkMode: theme === 'dark' }));
    }, [theme]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('userSettings');
                let parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};

                if (user?.id) {
                    try {
                        const backendSettings = await notificationService.getNotificationSettings(user.id);
                        parsedSettings = {
                            ...parsedSettings,
                            notificacionesPush: backendSettings.pushEnabled,
                            notificacionesEmail: backendSettings.emailEnabled,
                        };
                    } catch (error) {
                        logger.error(error, { context: 'loadNotificationSettings' });
                    }
                }

                if (typeof parsedSettings.darkMode === 'boolean' && setTheme) {
                    setTheme(parsedSettings.darkMode ? 'dark' : 'light');
                }
                setSettings(prev => ({
                    ...prev,
                    ...parsedSettings,
                    darkMode: typeof parsedSettings.darkMode === 'boolean' ? parsedSettings.darkMode : prev.darkMode,
                }));
            } catch (error) {
                logger.error(error, { context: 'loadSettings' });
            }
        };

        loadSettings();
    }, [setTheme, user?.id]);

    const handleUpdate = async (key: keyof SettingsState, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        try {
            await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));

            if (user?.id && (key === 'notificacionesPush' || key === 'notificacionesEmail')) {
                try {
                    await notificationService.updateNotificationSettings(user.id, {
                        pushEnabled: key === 'notificacionesPush' ? value : newSettings.notificacionesPush,
                        emailEnabled: key === 'notificacionesEmail' ? value : newSettings.notificacionesEmail,
                    });
                } catch (error) {
                    logger.error(error, { context: 'saveNotificationSettings' });
                }
            }
        } catch (error) {
            logger.error(error, { context: 'saveSettings' });
        }
    };

    const toggleSetting = (key: keyof SettingsState) => {
        const newValue = !settings[key];
        handleUpdate(key, newValue);

        if (key === 'darkMode' && setTheme) {
            setTheme(newValue ? 'dark' : 'light');
        }
    };

    const handleGoBack = () => onBack();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            logger.error(error, { context: 'signOut' });
        }
    };

    return {
        settings,
        colors,
        styles,
        handleGoBack,
        toggleSetting,
        handleSignOut,
    };
};