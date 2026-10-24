// File: frontend/src/styles/screens/transactions/transactions.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
export const isDesktop = width > 768;

// Exported constant getStyles.
export const getStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    return StyleSheet.create({

        // ─── Root ──────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        scrollContent: {
            paddingBottom: 100,
        },

        // ─── Mobile header ─────────────────────────────────────────────
        header: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            marginTop: 2,
        },

        // ─── Mobile main tabs ──────────────────────────────────────────
        tabsWrapper: {
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 12,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.08)',
            borderRadius: 14,
            padding: 4,
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 10,
            borderRadius: 11,
        },
        tabActive: {
            backgroundColor: colors.brand,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6 },
                android: { elevation: 4 },
                web: { boxShadow: `0 3px 10px ${colors.brand}55` } as any,
            }),
        },
        tabText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.mutedText,
        },
        tabTextActive: {
            color: '#ffffff',
        },

        // ─── Stats row ─────────────────────────────────────────────────
        statsRow: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
            marginTop: 8,
            marginBottom: 16,
        },
        statCard: {
            flex: 1,
            backgroundColor: colors.cardColor,
            borderRadius: 14,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        statLabel: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 4,
        },
        statValue: {
            fontSize: 22,
            fontWeight: '900',
            color: colors.textColor,
        },
        statBadge: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.success,
            marginTop: 2,
        },

        // ─── Section row ───────────────────────────────────────────────
        sectionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 17,
            fontWeight: '800',
            color: colors.textColor,
        },
        sectionAction: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.brand,
        },
        badge: {
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(197,160,89,0.12)' : 'rgba(197,160,89,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(197,160,89,0.3)',
        },
        badgeText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#C5A059',
            letterSpacing: 0.5,
        },

        // ─── Mobile card (purchase / sale) ─────────────────────────────
        purchaseCard: {
            marginHorizontal: 20,
            backgroundColor: colors.cardColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        profileCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 8,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        purchaseCardSelected: {
            borderColor: colors.brand,
        },
        purchaseHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 14,
        },
        purchaseHeaderLeft: {
            flexDirection: 'row',
            gap: 12,
            flex: 1,
        },
        purchaseThumb: {
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor: colors.brand,
            overflow: 'hidden',
        },
        purchaseThumbImg: {
            width: '100%',
            height: '100%',
        },
        purchaseOrderId: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        purchaseTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.textColor,
            marginTop: 2,
        },
        purchaseSeller: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.brand,
            marginTop: 2,
        },
        trackerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 12,
        },

        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 1,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 0.5,
        },

        // ─── Sub-tabs (inside cards on mobile) ────────────────────────
        subTabsRow: {
            flexDirection: 'row',
            gap: 6,
            marginBottom: 14,
        },
        subTab: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        },
        subTabActive: {
            borderColor: colors.brand,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.08)',
        },
        subTabText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.mutedText,
        },
        subTabTextActive: {
            color: colors.brand,
        },

        // ─── Tracker ───────────────────────────────────────────────────
        trackerWrapper: {
            paddingTop: 4,
            paddingBottom: 18,
            position: 'relative',
        },
        trackerLine: {
            position: 'absolute',
            top: 19,
            left: 15,
            right: 15,
            height: 2,
            backgroundColor: isDark ? 'rgba(44,89,38,0.3)' : '#e2e8f0',
            borderRadius: 1,
        },
        trackerLineProgress: {
            height: '100%',
            backgroundColor: colors.brand,
            borderRadius: 1,
        },
        trackerSteps: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        trackerStep: {
            alignItems: 'center',
            gap: 6,
        },
        trackerDot: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
        },
        trackerDotActive: {
            backgroundColor: colors.brand,
        },
        trackerDotInactive: {
            backgroundColor: isDark ? 'rgba(44,89,38,0.2)' : '#e2e8f0',
            borderWidth: 2,
            borderColor: colors.borderColor,
        },
        trackerStepLabel: {
            fontSize: 10,
            fontWeight: '600',
            color: colors.mutedText,
            textAlign: 'center',
        },
        trackerStepLabelActive: {
            color: colors.textColor,
            fontWeight: '800',
        },

        // ─── Location row ──────────────────────────────────────────────
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        locationLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flex: 1,
        },
        locationText: {
            fontSize: 12,
            color: colors.mutedText,
        },
        locationValue: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.textColor,
        },
        locationEta: {
            fontSize: 12,
            fontWeight: '800',
            color: '#C5A059',
        },

        // ─── Action buttons ────────────────────────────────────────────
        listingActionsRow: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 12,
        },
        btnPrimary: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: colors.brand,
            paddingVertical: 11,
            borderRadius: 12,
        },
        btnPrimaryStandalone: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.brand,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 18,
            minWidth: 170,
        },
        btnPrimaryText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '700',
        },
        btnGold: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: 'rgba(197,160,89,0.15)',
            paddingVertical: 11,
            borderRadius: 12,
        },
        btnGoldText: {
            color: '#C5A059',
            fontSize: 13,
            fontWeight: '700',
        },
        btnSecondary: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: isDark ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.1)',
            paddingVertical: 11,
            paddingHorizontal: 16,
            borderRadius: 12,
        },
        btnSecondaryText: {
            color: colors.textColor,
            fontSize: 14,
            fontWeight: '700',
        },
        disputeModalContainer: {
            width: '100%',
            maxHeight: '90%',
            backgroundColor: colors.cardColor,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'flex-end',
        },
        disputeModalHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
        },
        disputeModalTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: colors.textColor,
        },
        disputeModalSubtitle: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 4,
            maxWidth: '85%',
        },
        disputeModalLabel: {
            fontSize: 13,
            color: colors.mutedText,
            marginBottom: 10,
            fontWeight: '700',
        },
        disputeModalInput: {
            minHeight: 120,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            color: colors.textColor,
            padding: 14,
            textAlignVertical: 'top',
            marginBottom: 16,
        },
        disputePhotoRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 8,
        },
        disputePhotoThumb: {
            width: 76,
            height: 76,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: colors.borderColor,
        },
        disputePhotoImage: {
            width: '100%',
            height: '100%',
        },
        disputePhotoRemove: {
            position: 'absolute',
            top: 6,
            right: 6,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        disputeAddPhotoButton: {
            width: 76,
            height: 76,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
        },
        disputeAddPhotoText: {
            fontSize: 12,
            color: colors.mutedText,
            textAlign: 'center',
            marginTop: 4,
        },
        disputeModalHintText: {
            fontSize: 12,
            color: colors.mutedText,
            marginBottom: 16,
        },
        disputeModalActions: {
            flexDirection: 'row',
            gap: 10,
        },
        disputeModalActionButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        disputeModalCancelButton: {
            backgroundColor: colors.borderColor,
        },
        disputeModalCancelText: {
            color: colors.textColor,
            fontWeight: '700',
        },
        disputeModalSubmitButton: {
            backgroundColor: colors.brand,
        },
        disputeModalSubmitText: {
            color: '#fff',
            fontWeight: '700',
        },
        iconButton: {
            padding: 8,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        },

        // ─── Chat ──────────────────────────────────────────────────────
        chatHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            backgroundColor: colors.cardColor,
        },
        chatAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
        },
        chatAvatarText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 14,
        },
        chatCounterpart: {
            fontSize: 14,
            fontWeight: '800',
            color: colors.textColor,
        },
        chatOnlineRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            marginTop: 1,
        },
        chatOnlineDot: {
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: '#22c55e',
        },
        chatOnlineText: {
            fontSize: 11,
            color: colors.mutedText,
        },
        chatCallBtn: {
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        chatMessages: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
        },
        chatBubbleWrapper: {
            marginBottom: 10,
        },
        chatBubbleWrapperMe: {
            alignItems: 'flex-end',
        },
        chatBubbleWrapperThem: {
            alignItems: 'flex-start',
        },
        chatBubble: {
            maxWidth: '80%',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
        },
        chatBubbleMe: {
            backgroundColor: colors.brand,
            borderBottomRightRadius: 4,
        },
        chatBubbleThem: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderBottomLeftRadius: 4,
        },
        chatBubbleText: {
            fontSize: 14,
            color: colors.textColor,
            lineHeight: 20,
        },
        chatBubbleTextMe: {
            color: '#fff',
        },
        chatTime: {
            fontSize: 10,
            color: colors.mutedText,
            marginTop: 3,
        },
        chatInputRow: {
            flexDirection: 'row',
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: colors.borderColor,
            backgroundColor: colors.cardColor,
            alignItems: 'center',
            width: '100%',
        },
        chatInput: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 10,
            color: colors.textColor,
            fontSize: 15,
            height: 45,
            maxHeight: 120,
            alignItems: 'center',
            justifyContent: 'center',
        },
        chatSendBtn: {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.brand,
            alignItems: 'center',
            justifyContent: 'center',
        },

        // ─── Desktop root layout ───────────────────────────────────────
        desktopRoot: {
            flex: 1,
            flexDirection: 'row',
        },

        // ─── Desktop sidebar ───────────────────────────────────────────
        desktopSidebar: {
            width: 340,
            borderRightWidth: 1,
            borderRightColor: colors.borderColor,
            backgroundColor: isDark ? colors.backgroundColor : colors.cardColor,
            flexDirection: 'column',
        },
        desktopSidebarHeader: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        desktopSidebarTabs: {
            flexDirection: 'row',
            padding: 8,
            gap: 6,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        desktopSidebarTab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'transparent',
        },
        desktopSidebarTabActive: {
            backgroundColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.08)',
            borderColor: colors.brand + '40',
        },
        desktopSidebarTabText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.mutedText,
        },
        desktopSidebarTabTextActive: {
            color: colors.brand,
            fontWeight: '700',
        },

        // ─── Desktop list item ────────────────────────────────────────
        desktopListItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            position: 'relative',
            backgroundColor: 'transparent',
        },
        desktopListItemSelected: {
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.06)',
        },
        desktopListSelectedBar: {
            position: 'absolute',
            left: 0,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: 2,
            backgroundColor: colors.brand,
        },
        desktopListThumb: {
            width: 48,
            height: 48,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: colors.brand,
        },
        desktopListOrderId: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
        },
        desktopListTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: colors.textColor,
        },
        desktopListSub: {
            fontSize: 12,
            color: colors.mutedText,
        },

        // ─── Desktop detail panel ─────────────────────────────────────
        desktopDetailPanel: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.backgroundColor,
        },
        desktopDetailImage: {
            height: 200,
            position: 'relative',
            overflow: 'hidden',
        },
        desktopDetailImageOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.45)',
        },
        desktopDetailImageContent: {
            position: 'absolute',
            bottom: 16,
            left: 20,
            right: 80,
        },
        desktopDetailImageTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#fff',
            letterSpacing: -0.5,
        },
        desktopDetailImageSub: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 4,
        },

        // ─── Desktop detail sub-tabs ──────────────────────────────────
        desktopDetailSubTabs: {
            flexDirection: 'row',
            gap: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            paddingHorizontal: 20,
            backgroundColor: colors.cardColor,
        },
        desktopDetailSubTab: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            paddingVertical: 14,
            paddingHorizontal: 6,
            marginRight: 24,
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
        },
        desktopDetailSubTabActive: {
            borderBottomColor: colors.brand,
        },
        desktopDetailSubTabText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.mutedText,
        },
        desktopDetailSubTabTextActive: {
            color: colors.brand,
            fontWeight: '700',
        },

        // ─── Desktop detail info grid ─────────────────────────────────
        desktopDetailInfoGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        desktopDetailInfoCell: {
            minWidth: 140,
            flex: 1,
            backgroundColor: colors.cardColor,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        desktopDetailInfoLabel: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            marginBottom: 6,
        },
        desktopDetailInfoValue: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.textColor,
        },
        desktopDetailCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        desktopDetailCardTitle: {
            fontSize: 13,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 14,
        },

        // ─── Empty state ───────────────────────────────────────────────
        emptyState: {
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 40,
        },
        emptyStateIcon: {
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: colors.textColor,
            marginTop: 16,
            textAlign: 'center',
        },
        emptySubtitle: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 6,
            textAlign: 'center',
            lineHeight: 20,
        },
    });
};
