// File: frontend/src/styles/screens/auth/auth.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';
import { getPersonalDataCardShadow, getPersonalDataElevatedShadow } from '@/styles/shadows';

// Exported constant getStyles.
export const getStyles = (colors: ReturnType<typeof getThemeColors>) => {
    // Calculate isDark based on background color
    const isDark = colors.backgroundColor === '#161d15';

    const styles = StyleSheet.create({

        // ─── Layout ─────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        containerDesktop: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.backgroundColor,
        },

        // ─── Mobile header ───────────────────────────────────────────────
        header: {
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 32,
            gap: 10,
        },
        logoSquare: {
            width: 72,
            height: 72,
            backgroundColor: colors.brand,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
                android: { elevation: 8 },
                web: { boxShadow: `0px 6px 20px ${colors.brand}44` } as any,
            }),
        },
        mainTitle: {
            fontSize: 30,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.8,
        },
        subtitle: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.brand,
            letterSpacing: 3,
        },

        // ─── Desktop side panel ─────────────────────────────────────────
        desktopSidePanel: {
            flex: 1,
            backgroundColor: colors.brand,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
        },
        sidePanelContent: {
            width: '100%',
            maxWidth: 450,
            alignSelf: 'center',
        },
        desktopLogoWrap: {
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
        },
        desktopBrandText: {
            color: '#fff',
            fontSize: 48,
            fontWeight: '900',
            letterSpacing: -1.5,
            marginBottom: 40,
        },
        desktopFeatureList: {
            gap: 24,
            width: '100%',
        },
        desktopFeatureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        desktopFeatureIcon: {
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        desktopFeatureText: {
            color: 'rgba(255,255,255,0.9)',
            fontSize: 15,
            fontWeight: '500',
        },

        // ─── Scroll wrappers ─────────────────────────────────────────────
        scrollContent: {
            flexGrow: 1,
        },
        scrollDesktopContent: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        // ─── Card ────────────────────────────────────────────────────────
        card: {
            width: '100%',
            backgroundColor: colors.backgroundColor,
            overflow: 'visible',
            zIndex: 1,
        },
        cardDesktop: {
            width: 450,
            backgroundColor: colors.cardColor,
            padding: 40,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: colors.borderColor,
            ...getPersonalDataCardShadow(isDark),
        },

        // ─── Toggle (Login / Signup) ─────────────────────────────────────
        toggleContainer: {
            flexDirection: 'row',
            backgroundColor: colors.verificationBoxBackground,
            padding: 4,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.borderColor,
            marginBottom: 28,
        },
        toggleBtn: {
            flex: 1,
            paddingVertical: 11,
            alignItems: 'center',
            borderRadius: 10,
        },
        toggleBtnActive: {
            backgroundColor: colors.brand,
            ...getPersonalDataElevatedShadow(isDark),
        },
        toggleTextActive: { color: '#fff', fontWeight: '700', fontSize: 14 },
        toggleTextInactive: { color: colors.mutedText, fontWeight: '600', fontSize: 14 },

        // ─── Form ────────────────────────────────────────────────────────
        form: {
            width: '100%',
            gap: 15,
            overflow: 'visible',
        },
        inputContainer: {
            marginBottom: 16,
        },
        inputLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 7,
            marginLeft: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardColor,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 55,
        },
        inputWrapperFocused: {
            borderColor: colors.brand,
            backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.04)',
        },
        inputIcon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            paddingVertical: 15,
            color: colors.textColor,
            fontSize: 15,
        },

        phoneRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: '100%',
        },

        phoneField: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardColor,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderRadius: 14,
            height: 55,
        },

        phoneInputRaw: {
            flex: 1,
            height: '100%',
            paddingHorizontal: 12,
            color: colors.textColor,
            fontSize: 15,
        },

        // ─── Forgot password ──────────────────────────────────────────────
        forgotRow: {
            alignSelf: 'flex-end',
            marginTop: -8,
            marginBottom: 12,
        },
        forgotText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.brand,
        },

        // ─── Submit button ────────────────────────────────────────────────
        submitBtn: {
            backgroundColor: colors.brand,
            paddingVertical: 17,
            borderRadius: 14,
            marginTop: 8,
            alignItems: 'center',
            ...getPersonalDataElevatedShadow(isDark),
        },
        submitBtnText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '800',
            letterSpacing: 0.2,
        },

        // ─── Divider ──────────────────────────────────────────────────────
        dividerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 24,
            marginBottom: 16,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: colors.borderColor,
        },
        dividerText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.mutedText,
        },

        // ─── Google / social button ───────────────────────────────────────
        googleBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 15,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            backgroundColor: colors.cardColor,
        },
        googleBtnText: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textColor,
        },

        // ─── Confirm email box ────────────────────────────────────────────
        confirmBox: {
            alignItems: 'center',
            paddingVertical: 8,
        },
        confirmIconWrap: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        confirmTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: colors.textColor,
            marginBottom: 8,
        },
        confirmSubtitle: {
            fontSize: 14,
            color: colors.mutedText,
            textAlign: 'center',
            lineHeight: 21,
        },

        // ─── Footer ───────────────────────────────────────────────────────
        footerContainer: {
            marginTop: 28,
            alignItems: 'center',
        },
        footerText: {
            color: colors.mutedText,
            fontSize: 14,
        },
        linkText: {
            color: colors.brand,
            fontWeight: '700',
        },
    });

    return styles;
};