// File: frontend/src/styles/screens/dashboard/help.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// Exported constant getHelpStyles.
export const getHelpStyles = (colors: ReturnType<typeof getThemeColors>) => {
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
        header: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        headerTitle: {
            fontSize: 26,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 3,
        },
        searchWrap: {
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        searchInput: {
            flex: 1,
            marginLeft: 10,
            color: colors.textColor,
            fontSize: 15,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 60,
            paddingTop: 12,
            gap: 20,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            marginTop: 4,
        },

        // ─── FAQ accordion card ─────────────────────────────────────────────
        faqCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
            marginBottom: 8,
        },
        faqHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
        faqHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        faqIcon: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(44,89,38,0.18)' : 'rgba(44,89,38,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        faqQuestion: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.textColor,
            flex: 1,
        },
        faqAnswer: {
            fontSize: 13,
            color: colors.mutedText,
            lineHeight: 20,
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 0,
        },

        // ─── Contact cards ────────────────────────────────────────────────
        contactRow: {
            flexDirection: 'row',
            gap: 10,
        },
        contactCard: {
            flex: 1,
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            alignItems: 'center',
            gap: 8,
            ...Platform.select({
                web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } as any,
            }),
        },
        contactIcon: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(44,89,38,0.18)' : 'rgba(44,89,38,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        contactLabel: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.textColor,
            textAlign: 'center',
        },
        contactSub: {
            fontSize: 11,
            color: colors.mutedText,
            textAlign: 'center',
        },

        // ─── Hero banner ─────────────────────────────────────────────────
        heroBanner: {
            borderRadius: 18,
            backgroundColor: colors.brand,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginBottom: 4,
            ...Platform.select({
                web: { boxShadow: `0 6px 20px ${colors.brand}55` } as any,
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 },
                android: { elevation: 8 },
            }),
        },
        heroBannerIcon: {
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        heroBannerTitle: {
            fontSize: 17,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 3,
        },
        heroBannerSub: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
        },
        heroBannerBtn: {
            marginTop: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignSelf: 'flex-start',
        },
        heroBannerBtnText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#ffffff',
        },
        docSection: {
            marginBottom: 22,
        },
        docButton: {
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            marginBottom: 12,
        },
        docButtonText: {
            fontSize: 15,
            fontWeight: '700',
            color: colors.textColor,
        },

        // ─── Topic chip ───────────────────────────────────────────────────
        topicChip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            backgroundColor: colors.cardColor,
            marginRight: 8,
        },
        topicChipText: {
            fontSize: 13,
            color: colors.mutedText,
            fontWeight: '600',
        },
    });

    return styles;
};
