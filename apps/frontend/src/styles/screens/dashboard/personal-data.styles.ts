// File: frontend/src/styles/screens/dashboard/personal-data.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// ─── NO Dimensions.get() at module level ──────────────────────────────────────
// All responsive sizing is handled via useWindowDimensions() in the screen.

// Exported constant getPersonalDataStyles.
export const getPersonalDataStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    // ── Shared tokens ──────────────────────────────────────────────────────────
    const brandAlpha = (o: number) => `rgba(44,89,38,${o})`;

    const cardBg = isDark ? 'rgba(255,255,255,0.04)' : colors.cardColor;
    const cardBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)';
    const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const styles = StyleSheet.create({

        // ─── Root layout ────────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        desktopContainer: {
            flex: 1,
            maxWidth: 820,
            alignSelf: 'center',
            width: '100%',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 80,
        },
        content: {
            flex: 1,
            // paddingHorizontal injected inline from useWindowDimensions
            paddingTop: 24,
        },
        contentDesktop: {
            maxWidth: 820,
            alignSelf: 'center',
            width: '100%',
        },

        // ─── Header ─────────────────────────────────────────────────────────────
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
        backButton: {
            width: 38,
            height: 38,
            borderRadius: 11,
            backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : colors.cardColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
            flexShrink: 0,
        },

        // ─── Avatar card ────────────────────────────────────────────────────────
        avatarCard: {
            marginBottom: 28,
            borderRadius: 22,
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: cardBorder,
            padding: 24,
            alignItems: 'center',
            gap: 10,
            overflow: 'hidden',
        },
        avatarRing: {
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#fff',
        },
        avatarInitial: {
            fontSize: 34,
            fontWeight: '900' as any,
            color: '#fff',
            letterSpacing: 0.5,
        },
        avatarName: {
            fontSize: 19,
            fontWeight: '800' as any,
            color: colors.textColor,
            letterSpacing: -0.3,
            marginTop: 2,
        },
        avatarEmail: {
            fontSize: 13,
            color: colors.mutedText,
            fontWeight: '500' as any,
        },

        // ─── Section group ───────────────────────────────────────────────────────
        sectionGroup: {
            marginBottom: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: '800' as any,
            color: colors.brand,
            textTransform: 'uppercase',
            letterSpacing: 1.6,
            marginBottom: 0,
            paddingLeft: 2,
        },
        verifiedBadgeInline: {
            marginLeft: 10,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 18,
            marginTop: 0,
        },

        // ─── Form card ───────────────────────────────────────────────────────────
        formCard: {
            backgroundColor: cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: cardBorder,
            overflow: 'hidden',
        },

        // ─── Form row ────────────────────────────────────────────────────────────
        // Base: column layout (overridden to row via responsiveRowStyle on medium+)
        formRow: {
            flexDirection: 'column',
            paddingVertical: 14,
            // paddingHorizontal, gap, minHeight injected via responsiveRowStyle
            width: '100%',
        },
        formRowBorder: {
            borderTopWidth: 1,
            borderTopColor: divider,
        },

        // ─── Icon + label wrapper ─────────────────────────────────────────────────
        formLabelWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            // width injected via responsiveLabelStyle when in row mode
        },
        formIconWrap: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: brandAlpha(isDark ? 0.2 : 0.1),
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        formLabel: {
            fontSize: 14,
            fontWeight: '600' as any,
            color: colors.textColor,
        },

        // ─── Input wrapper ────────────────────────────────────────────────────────
        inputContainer: {
            flex: 1,
            minWidth: 0,
        },
        formInput: {
            flex: 1,
            fontSize: 15,
            color: colors.textColor,
            minHeight: 48,
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F6F8',
            borderRadius: 13,
            borderWidth: 1,
            borderColor: cardBorder,
        },

        // ─── Phone ────────────────────────────────────────────────────────────────
        phoneInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
            zIndex: 10,
            elevation: 10,
        },
        phoneSelectWrap: {
            width: 72,
            height: 46,
            zIndex: 11,
        },

        // ─── Verification badge (phone already verified) ──────────────────────────
        verifiedBadgeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(44,89,38,0.1)' : '#E8F5E9',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            alignSelf: 'flex-start',
            marginTop: 10,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.1)',
            gap: 6,
        },
        verifiedBadgeText: {
            fontSize: 12,
            fontWeight: '700' as any,
            color: colors.brand,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
        },

        // ─── Verify button (send code) ────────────────────────────────────────────
        verifyButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.brand,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 14,
        },
        verifyButtonDisabled: {
            opacity: 0.55,
        },
        verifyButtonText: {
            fontSize: 14,
            fontWeight: '700' as any,
            color: '#fff',
        },

        // ─── Save button ──────────────────────────────────────────────────────────
        saveButton: {
            backgroundColor: colors.brand,
            paddingVertical: 18,
            borderRadius: 18,
            alignItems: 'center',
        },
        saveButtonDisabled: {
            opacity: 0.45,
        },
        saveButtonText: {
            fontSize: 16,
            fontWeight: '700' as any,
            color: '#fff',
            letterSpacing: 0.4,
        },
    });

    return styles;
};