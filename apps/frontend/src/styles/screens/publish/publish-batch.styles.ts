// File: frontend/src/styles/screens/publish/publish-batch.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
export const isDesktop = width > 768;

// Exported constant getStyles.
export const getStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    return StyleSheet.create({

        // ─── Root ──────────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },

        // ─── Mobile header ─────────────────────────────────────────────────
        header: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        headerTitle: {
            color: colors.textColor,
            fontSize: 24,
            fontWeight: '900',
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            color: colors.mutedText,
            fontSize: 13,
            marginTop: 4,
        },

        // ─── Desktop header ────────────────────────────────────────────────
        desktopHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 32,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        desktopHeaderRight: {
            flexDirection: 'row',
            gap: 12,
        },
        saveDraftBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: colors.brand + '60',
            backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.06)',
        },
        saveDraftText: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.brand,
        },

        // ─── Step indicator ────────────────────────────────────────────────
        desktopStepBar: {
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            paddingVertical: 12,
            paddingHorizontal: 32,
        },
        stepRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 0,
        },
        stepItem: {
            alignItems: 'center',
            gap: 6,
        },
        stepDot: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        stepDotActive: {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6 },
                android: { elevation: 4 },
                web: { boxShadow: `0 3px 10px ${colors.brand}55` } as any,
            }),
        },
        stepDotDone: {
            backgroundColor: colors.brand,
            borderColor: colors.brand,
            opacity: 0.7,
        },
        stepNumber: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
        },
        stepNumberActive: {
            color: '#fff',
        },
        stepLabel: {
            fontSize: 10,
            fontWeight: '600',
            color: colors.mutedText,
        },
        stepLabelActive: {
            color: colors.brand,
            fontWeight: '800',
        },
        stepConnector: {
            width: 32,
            height: 1.5,
            backgroundColor: colors.borderColor,
            marginHorizontal: 4,
            marginBottom: 18,
        },
        stepConnectorDone: {
            backgroundColor: colors.brand,
            opacity: 0.5,
        },

        // ─── Scroll / grid ─────────────────────────────────────────────────
        scrollContent: {
            paddingBottom: 60,
            paddingHorizontal: isDesktop ? 0 : 16,
        },
        desktopScrollContent: {
            padding: 24,
        },
        mainWrapper: {
            width: '100%',
            maxWidth: isDesktop ? 1100 : '100%',
            alignSelf: 'center',
            paddingHorizontal: isDesktop ? 0 : 4,
        },
        desktopGrid: {
            flexDirection: 'row',
            gap: 20,
            maxWidth: 1100,
            alignSelf: 'center',
            width: '100%',
        },
        desktopCol: {
            flex: 1,
            gap: 16,
        },

        // ─── Section card ──────────────────────────────────────────────────
        sectionCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
            ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: isDark ? 0.25 : 0.07, shadowRadius: 8 },
                android: { elevation: 3 },
                web: { boxShadow: isDark ? '0 3px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)' } as any,
            }),
        },
        fullWidthCard: {
            // Used in desktop to force full width if needed
        },
        multimediaCard: {
            borderBottomWidth: 3,
            borderBottomColor: colors.brand,
        },

        // ─── Section title row ─────────────────────────────────────────────
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: colors.textColor,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },

        // ─── Upload area ───────────────────────────────────────────────────
        uploadArea: {
            height: 170,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: colors.brand + '80',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(44,89,38,0.1)' : 'rgba(44,89,38,0.04)',
        },
        cameraIconContainer: {
            backgroundColor: colors.brand,
            padding: 14,
            borderRadius: 50,
            marginBottom: 8,
        },
        mediaItem: {
            width: 112,
            marginRight: 12,
            position: 'relative',
        },
        mediaPreview: {
            width: 112,
            height: 112,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            borderWidth: 1,
            borderColor: colors.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        mediaPreviewVideo: {
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        mediaPreviewImage: {
            width: '100%',
            height: '100%',
        },
        mediaVideoFallback: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.35)',
        },
        mediaVideoOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.14)',
        },
        mediaName: {
            marginTop: 8,
            fontSize: 11,
            fontWeight: '700',
            color: colors.textColor,
            maxWidth: 112,
        },
        mediaRemove: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tipsRow: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 14,
            flexWrap: 'wrap',
        },
        tipChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(44,89,38,0.15)' : 'rgba(44,89,38,0.07)',
        },
        tipText: {
            fontSize: 11,
            color: colors.brand,
            fontWeight: '600',
        },

        // ─── Form inputs ───────────────────────────────────────────────────
        label: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 7,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
        },
        input: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            color: colors.textColor,
            borderWidth: 1,
            borderColor: colors.borderColor,
            fontSize: 14,
            width: '100%',
        },
        pickerButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        pickerText: {
            fontSize: 14,
            color: colors.textColor,
            fontWeight: '600',
        },
        row: {
            flexDirection: 'row',
            gap: 12,
            width: '100%',
            flexWrap: 'wrap',
        },
        flex1: {
            flex: isDesktop ? 1 : 1,
            minWidth: isDesktop ? 150 : 120,
        },
        counterRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        counterInput: {
            flex: 1,
            borderWidth: 0,
            textAlign: 'center',
            height: 45,
            fontSize: 16,
            backgroundColor: 'transparent',
        },
        counterBtn: {
            width: 40,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        },

        // ─── Map placeholder ───────────────────────────────────────────────
        mapPlaceholder: {
            height: 160,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 14,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderStyle: 'dashed',
        },

        // ─── Currency toggle ───────────────────────────────────────────────
        toggleGroup: {
            flexDirection: 'row',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            padding: 5,
            borderRadius: 14,
            marginBottom: 16,
        },
        toggleItem: {
            flex: 1,
            paddingVertical: 11,
            alignItems: 'center',
            borderRadius: 10,
        },

        // ─── Price input ───────────────────────────────────────────────────
        priceInputWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            paddingLeft: 14,
            marginBottom: 12,
        },
        currencyLabel: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.brand,
            paddingRight: 8,
            borderRightWidth: 1,
            borderRightColor: colors.borderColor,
        },
        priceInput: {
            flex: 1,
            fontSize: 32,
            fontWeight: '900',
            textAlign: 'center',
            height: 72,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderWidth: 0,
            backgroundColor: 'transparent',
        },

        // ─── Price breakdown ───────────────────────────────────────────────
        priceBreakdown: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 16,
        },
        breakdownItem: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.06)',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
        },
        breakdownLabel: {
            fontSize: 11,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 4,
        },
        breakdownValue: {
            fontSize: 15,
            fontWeight: '800',
            color: colors.brand,
        },

        // ─── Fee box ────────────────────────────────────────────────────────
        feeContainer: {
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#f0f4f0',
            padding: 18,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.borderColor,
        },
        feeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        feeLabel: {
            fontSize: 15,
            fontWeight: '500',
            color: isDark ? '#abb2bf' : '#666',
            letterSpacing: -0.3,
        },
        feeLabelBold: {
            fontSize: 15,
            fontWeight: '700',
            color: isDark ? '#fff' : '#222',
        },
        feeValue: {
            fontSize: 17,
            fontWeight: '800',
            color: colors.brand,
            textAlign: 'right',
        },
        feeValueBold: {
            fontSize: 18,
            fontWeight: '900',
            color: isDark ? '#ffffff' : '#000000',
            letterSpacing: 0.2,
        },
        divider: {
            height: 1,
            backgroundColor: colors.borderColor,
            marginVertical: 14,
        },

        // ─── Preview card (desktop) ────────────────────────────────────────
        previewCard: {
            backgroundColor: colors.cardColor,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
            overflow: 'hidden',
        },
        previewTitle: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 1,
            paddingHorizontal: 18,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        previewBody: {
            padding: 18,
            gap: 6,
        },
        previewTag: {
            alignSelf: 'flex-start',
            backgroundColor: isDark ? 'rgba(44,89,38,0.25)' : 'rgba(44,89,38,0.1)',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
        },
        previewTagText: {
            fontSize: 11,
            fontWeight: '700',
            color: colors.brand,
        },
        previewHeading: {
            fontSize: 17,
            fontWeight: '900',
            color: colors.textColor,
            lineHeight: 23,
        },
        previewMeta: {
            fontSize: 12,
            color: colors.mutedText,
        },
        previewPrice: {
            fontSize: 20,
            fontWeight: '900',
            color: '#C5A059',
            marginTop: 4,
        },

        // ─── Publish button ────────────────────────────────────────────────
        publishButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: colors.brand,
            padding: 18,
            borderRadius: 18,
            marginVertical: 16,
            marginHorizontal: isDesktop ? 0 : 0,
            ...Platform.select({
                ios: { shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
                android: { elevation: 6 },
                web: { boxShadow: `0 6px 20px ${colors.brand}55` } as any,
            }),
        },
        buttonText: {
            color: 'white',
            fontWeight: '800',
            fontSize: 17,
        },

        // ─── Picker modal ──────────────────────────────────────────────────
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.cardColor,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: '70%',
            padding: 24,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: colors.textColor,
        },
        modalOption: {
            paddingVertical: 16,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },
        modalOptionText: {
            fontSize: 16,
            color: colors.textColor,
            fontWeight: '500',
        },
    });
};
