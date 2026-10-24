// File: frontend/src/styles/screens/market/market.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// Exported constant getStyles.
export const getStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    const styles = StyleSheet.create({

        // ─── Root ────────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        contentLayout: {
            flexDirection: 'column',
            gap: 40,
            paddingHorizontal: 16,
            paddingTop: 40,
            paddingBottom: 20,
        },
        statsRow: {
            flexDirection: 'row',
            gap: 16,
        },

        // ─── Header row ───────────────────────────────────────────────────
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: colors.backgroundColor,
        },
        logoIconWrap: {
            width: 44,
            height: 44,
            borderRadius: 13,
            backgroundColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
                android: { elevation: 5 },
                web: { boxShadow: `0 4px 14px ${colors.brand}55` } as any,
            }),
        },
        title: {
            fontSize: 22,
            fontWeight: '900',
            color: colors.textColor,
            letterSpacing: -0.5,
        },
        rate: {
            fontSize: 11,
            color: colors.mutedText,
            fontWeight: '600',
            marginTop: 1,
        },
        iconButton: {
            position: 'relative',
            padding: 10,
            backgroundColor: colors.verificationBoxBackground,
            borderRadius: 50,
        },
        notificationDot: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            backgroundColor: '#ef4444',
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: colors.backgroundColor,
        },

        // ─── Search blur wrapper ──────────────────────────────────────────
        searchBlurWrap: {
            paddingBottom: 12,
            paddingTop: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        },
        searchRow: {
            flexDirection: 'row',
            gap: 10,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: colors.borderColor,
            ...Platform.select({
                web: { marginTop: 3 }
            }),
        },
        filterButton: {
            position: 'relative',
            backgroundColor: colors.brand,
            width: 48,
            height: 48,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterActiveDot: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#C5A059',
            borderWidth: 1.5,
            borderColor: colors.brand,
        },
        typeButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: colors.cardColor,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },

        // ─── Results bar ─────────────────────────────────────────────────
        resultsBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        resultsCount: {
            fontSize: 14,
            color: colors.mutedText,
            fontWeight: '600',
        },
        clearFiltersBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.08)',
        },
        clearFiltersText: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.brand,
        },

        // ─── Desktop sidebar ──────────────────────────────────────────────
        desktopSidebar: {
            width: 260,
            borderRightWidth: 1,
            borderRightColor: colors.borderColor,
            backgroundColor: isDark ? colors.backgroundColor : colors.cardColor,
        },
        desktopSidebarHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        desktopSidebarTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.textColor,
        },
        desktopSidebarReset: {
            fontSize: 13,
            fontWeight: '600',
            color: '#ef4444',
        },
        desktopFilterLabel: {
            fontSize: 10,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 4,
        },
        desktopFilterItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
        },
        desktopFilterItemActive: {
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.07)',
        },
        desktopFilterItemText: {
            fontSize: 14,
            color: colors.mutedText,
            fontWeight: '500',
        },
        desktopFilterItemTextActive: {
            color: colors.brand,
            fontWeight: '700',
        },

        // ─── Chips / filters ─────────────────────────────────────────────
        chip: {
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            backgroundColor: colors.cardColor,
        },
        activeChip: {
            borderColor: colors.brand,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.07)',
        },
        wrapContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 8,
        },
        groupBtn: {
            flex: 1,
            padding: 10,
            borderRadius: 10,
            backgroundColor: colors.cardColor,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        activeGroup: {
            borderColor: colors.brand,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.07)',
        },
        breedChip: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.brand,
        },

        // ─── Empty state ──────────────────────────────────────────────────
        emptyState: {
            alignItems: 'center',
            paddingTop: 60,
            gap: 12,
        },
        emptyText: {
            fontSize: 15,
            color: colors.mutedText,
            fontWeight: '600',
        },
        emptyReset: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.08)',
        },

        // ─── Modal ────────────────────────────────────────────────────────
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.backgroundColor,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            maxHeight: '82%',
            maxWidth: 540,
            width: '100%',
            alignSelf: 'center',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: colors.textColor,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '800',
            color: colors.textColor,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
        },
        applyButton: {
            backgroundColor: colors.brand,
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 10,
        },
        applyButtonText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 15,
        },

        // ─── Legacy aliases (kept for ListingCard compat) ─────────────────
        header: { padding: 16, backgroundColor: colors.backgroundColor },
        card: { backgroundColor: colors.cardColor, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderColor },
        cardImage: { width: '100%', height: 180 },
        cardContent: { padding: 16 },
        price: { fontSize: 20, fontWeight: 'bold', color: colors.brand },
        locationSelector: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.borderColor, gap: 8 },
    });

    return styles;
};
