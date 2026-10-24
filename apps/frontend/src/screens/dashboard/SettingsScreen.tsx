// File: frontend/src/screens/dashboard/SettingsScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, ScrollView, useWindowDimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/settings/use-settings';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsToggleRow } from '@/components/settings/SettingsToggleRow';
import { SettingsDangerRow } from '@/components/settings/SettingsDangerRow';

interface SettingsScreenProps {
    onBack: () => void;
}

// Default React component export.
export default function SettingsScreen({ onBack }: SettingsScreenProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        settings,
        colors,
        styles,
        handleGoBack,
        toggleSetting,
        handleSignOut,
    } = useSettings(onBack);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={isDesktop ? styles.desktopContainer : { flex: 1 }}>
                <SettingsHeader
                    colors={colors}
                    styles={styles}
                    onBack={handleGoBack}
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.sectionGroup}>
                        <Text style={styles.sectionLabel}>Notificaciones</Text>
                        <View style={styles.settingsCard}>
                            <SettingsToggleRow
                                icon="notifications"
                                label="Notificaciones push"
                                value={settings.notificacionesPush}
                                onToggle={() => toggleSetting('notificacionesPush')}
                                colors={colors}
                                styles={styles}
                            />
                            <View style={styles.settingsRowBorder} />
                            <SettingsToggleRow
                                icon="email"
                                label="Notificaciones por email"
                                value={settings.notificacionesEmail}
                                onToggle={() => toggleSetting('notificacionesEmail')}
                                colors={colors}
                                styles={styles}
                            />
                        </View>
                    </View>

                    <View style={styles.sectionGroup}>
                        <Text style={styles.sectionLabel}>Apariencia</Text>
                        <View style={styles.settingsCard}>
                            <SettingsToggleRow
                                icon="brightness-2"
                                label="Modo oscuro"
                                value={settings.darkMode}
                                onToggle={() => toggleSetting('darkMode')}
                                colors={colors}
                                styles={styles}
                            />
                        </View>
                    </View>

                    <View style={styles.sectionGroup}>
                        <Text style={styles.sectionLabel}>Cuenta</Text>
                        <View style={styles.settingsCard}>
                            <SettingsDangerRow
                                label="Cerrar Sesión"
                                onPress={handleSignOut}
                                colors={colors}
                                styles={styles}
                            />
                        </View>
                    </View>

                    <Text style={styles.versionText}>AgroMarket v1.0.0</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
