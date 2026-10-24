// File: frontend/src/styles/screens/dashboard/settings.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// Exported constant getSettingsStyles.
export const getSettingsStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        desktopContainer: {
            flex: 1,
            maxWidth: 800,
            alignSelf: 'center',
            width: '100%',
        },
        scrollContent: {
            paddingBottom: 60,
        },
        header: {
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        headerTitle: {
            fontSize: 26,
            fontWeight: '900' as any,
            color: colors.textColor,
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 3,
        },

        // ─── Profile card ─────────────────────────────────────────────────
        profileCard: {
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 18,
            backgroundColor: colors.cardColor,
            borderWidth: 1,
            borderColor: colors.borderColor,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 18,
            backgroundColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
        },
        profileName: {
            fontSize: 17,
            fontWeight: '800',
            color: colors.textColor,
        },
        profileRole: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 2,
        },
        profileEdit: {
            marginLeft: 'auto' as any,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: colors.brand,
        },
        profileEditText: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.brand,
        },

        // ─── Section group ────────────────────────────────────────────────
        sectionGroup: {
            marginHorizontal: 20,
            marginTop: 24,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            paddingLeft: 4,
        },
        settingsCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        settingsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            gap: 14,
        },
        settingsRowBorder: {
            borderTopWidth: 1,
            borderTopColor: colors.borderColor,
        },
        settingsIconWrap: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(44,89,38,0.18)' : 'rgba(44,89,38,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        settingsLabel: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: colors.textColor,
        },
        settingsValue: {
            fontSize: 13,
            color: colors.mutedText,
            marginRight: 4,
        },

        // ─── Toggle ────────────────────────────────────────────────────────
        toggle: {
            width: 46,
            height: 26,
            borderRadius: 13,
            justifyContent: 'center',
            paddingHorizontal: 3,
        },
        toggleOn: {
            backgroundColor: colors.brand,
        },
        toggleOff: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
        },
        toggleThumb: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#ffffff',
        },

        // ─── Danger section ──────────────────────────────────────────────
        dangerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            gap: 14,
        },
        dangerText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ef4444',
            flex: 1,
        },

        // ─── Version ───────────────────────────────────────────────────────
        versionText: {
            fontSize: 12,
            color: colors.mutedText,
            textAlign: 'center',
            marginTop: 28,
            marginBottom: 8,
        },
    });

    return styles;
};
