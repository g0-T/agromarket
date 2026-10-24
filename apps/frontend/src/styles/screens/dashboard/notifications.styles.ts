// File: frontend/src/styles/screens/dashboard/notifications.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// Exported constant getNotificationsStyles.
export const getNotificationsStyles = (colors: ReturnType<typeof getThemeColors>) => {
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

        // ─── Notification item ────────────────────────────────────────────
        notificationCard: {
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 16,
            backgroundColor: colors.cardColor,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
            ...Platform.select({
                web: { boxShadow: '0 2px 12px rgba(0,0,0,0.07)' } as any,
            }),
        },
        notificationRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 16,
            gap: 14,
        },
        notificationIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        notificationContent: {
            flex: 1,
            gap: 4,
        },
        notificationTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: colors.textColor,
            lineHeight: 20,
        },
        notificationMessage: {
            fontSize: 13,
            color: colors.mutedText,
            lineHeight: 18,
        },
        notificationTime: {
            fontSize: 11,
            color: colors.mutedText,
            marginTop: 4,
        },
        notificationUnread: {
            position: 'absolute',
            top: 16,
            right: 16,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.brand,
        },

        // ─── Empty state ───────────────────────────────────────────────────
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            gap: 16,
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isDark ? 'rgba(44,89,38,0.18)' : 'rgba(44,89,38,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.textColor,
            textAlign: 'center',
        },
        emptySubtitle: {
            fontSize: 14,
            color: colors.mutedText,
            textAlign: 'center',
            paddingHorizontal: 40,
        },

        // ─── Mark all read button ──────────────────────────────────────────
        markAllButton: {
            marginHorizontal: 20,
            marginTop: 16,
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: colors.brand,
            borderRadius: 12,
            alignItems: 'center',
        },
        markAllButtonText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#fff',
        },
    });

    return styles;
};