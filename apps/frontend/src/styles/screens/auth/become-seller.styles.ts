// File: frontend/src/styles/screens/auth/become-seller.styles.ts
// Screen component defining a top-level app view.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// NOTE: No Dimensions.get() at module level — all responsive logic is handled
// at render time via useWindowDimensions() in the screen/components.

// Exported constant getBecomeSellerStyles.
export const getBecomeSellerStyles = (colors: ReturnType<typeof getThemeColors>) => {
    const isDark = colors.backgroundColor === '#161d15';

    // ─── Shadows ──────────────────────────────────────────────────────────────
    const elevatedShadow = Platform.select({
        ios: {
            shadowColor: isDark ? '#000' : '#1a2e17',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.4 : 0.1,
            shadowRadius: 28,
        },
        android: { elevation: 10 },
        web: {
            boxShadow: isDark
                ? '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)'
                : '0 12px 40px rgba(26,46,23,0.1), 0 2px 8px rgba(0,0,0,0.04)',
        } as any,
    });

    const cardShadow = Platform.select({
        ios: {
            shadowColor: isDark ? '#000' : '#1a2e17',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.07,
            shadowRadius: 16,
        },
        android: { elevation: 5 },
        web: {
            boxShadow: isDark
                ? '0 4px 20px rgba(0,0,0,0.35)'
                : '0 4px 20px rgba(26,46,23,0.07)',
        } as any,
    });

    const subtleShadow = Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.15 : 0.04,
            shadowRadius: 8,
        },
        android: { elevation: 2 },
        web: {
            boxShadow: isDark
                ? '0 2px 12px rgba(0,0,0,0.25)'
                : '0 2px 12px rgba(0,0,0,0.05)',
        } as any,
    });

    const brandAlpha = (opacity: number) => `rgba(44,89,38,${opacity})`;

    const styles = StyleSheet.create({
        // ─── Layout ───────────────────────────────────────────────────────────
        container: {
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        desktopContainer: {
            flex: 1,
            maxWidth: 860,
            alignSelf: 'center',
            width: '100%',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 100,
        },
        content: {
            flex: 1,
            // paddingHorizontal is set inline from useWindowDimensions
            paddingTop: 28,
        },
        contentDesktop: {
            maxWidth: 860,
            alignSelf: 'center',
            width: '100%',
        },

        // ─── Header ───────────────────────────────────────────────────────────
        header: {
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: colors.backgroundColor,
            borderBottomWidth: 1,
            borderBottomColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.06)',
            zIndex: 10,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: '800' as any,
            color: colors.textColor,
            letterSpacing: -0.6,
        },

        // ─── Sections ─────────────────────────────────────────────────────────
        section: {
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '800' as any,
            color: colors.textColor,
            marginBottom: 6,
            letterSpacing: -0.3,
        },
        sectionDescription: {
            fontSize: 14,
            color: colors.mutedText,
            marginBottom: 18,
            lineHeight: 21,
        },

        // ─── Row / Field Layout ───────────────────────────────────────────────
        row: {
            flexDirection: 'column',
            paddingVertical: 12,
            gap: 8,
            width: '100%',
        },
        label: {
            fontSize: 13,
            fontWeight: '700' as any,
            color: colors.mutedText,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
        },
        inputContainer: {
            flex: 1,
            minWidth: 0,
        },

        // ─── Status Banner ─────────────────────────────────────────────────────
        statusContainer: {
            marginBottom: 28,
            padding: 20,
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.07)',
            gap: 0,
            ...cardShadow,
        },
        statusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
        },
        statusText: {
            fontSize: 15,
            fontWeight: '600' as any,
            color: colors.textColor,
            flex: 1,
            lineHeight: 22,
        },
        adminNotes: {
            fontSize: 13,
            color: colors.error,
            marginTop: 14,
            fontStyle: 'italic',
            backgroundColor: isDark ? 'rgba(255,0,0,0.08)' : '#FFF0F0',
            padding: 14,
            borderRadius: 12,
            borderLeftWidth: 3,
            borderLeftColor: colors.error,
            lineHeight: 20,
            overflow: 'hidden',
        },
        submittedAt: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 10,
            fontWeight: '500',
        },
        reviewedAt: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 3,
        },
        statusLoadingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },

        // ─── Document Upload ───────────────────────────────────────────────────
        documentsNote: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginTop: 16,
            padding: 14,
            backgroundColor: brandAlpha(isDark ? 0.12 : 0.07),
            borderRadius: 14,
            borderLeftWidth: 3,
            borderLeftColor: colors.brand,
        },
        documentsNoteText: {
            fontSize: 13,
            color: isDark ? '#C8D8C6' : '#3D5C3A',
            flex: 1,
            lineHeight: 20,
        },
        locationCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            padding: 16,
            borderRadius: 18,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(244,247,242,1)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,100,0.18)',
            marginBottom: 16,
        },
        locationInfo: {
            flex: 1,
        },
        locationLabel: {
            fontSize: 13,
            color: colors.mutedText,
            fontWeight: '700' as any,
            marginBottom: 4,
        },
        locationText: {
            fontSize: 14,
            color: colors.textColor,
            lineHeight: 20,
        },
        locationAddress: {
            fontSize: 13,
            color: colors.mutedText,
            marginTop: 4,
        },
        locationButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: colors.brand,
            borderRadius: 14,
        },
        locationButtonText: {
            fontSize: 14,
            fontWeight: '700' as any,
            color: '#fff',
        },

        // ─── Location Picker ────────────────────────────────────
        locationPickerContainer: {
            position: 'absolute' as const,
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: 20,
        },
        locationPickerOverlay: {
            position: 'absolute' as const,
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: 20,
        },
        locationPickerCard: {
            backgroundColor: colors.backgroundColor,
            borderRadius: 0,
            width: '100%',
            height: '100%',
            padding: Platform.select({ web: 60, default: 20 }),
            borderWidth: 0,
            ...cardShadow,
        },
        locationPickerHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
        },
        locationPickerTitle: {
            fontSize: 20,
            fontWeight: '800' as any,
            color: colors.textColor,
            marginBottom: 4,
        },
        locationPickerSubtitle: {
            fontSize: 14,
            color: colors.mutedText,
        },
        closeButton: {
            padding: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5',
            borderRadius: 20,
        },
        searchWrapper: {
            position: 'relative' as const,
            marginBottom: 20,
            zIndex: 2000,
            overflow: 'visible' as const,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f9f9f9',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee',
            borderRadius: 12,
            paddingLeft: 12,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: ({
            flex: 1,
            height: Platform.select({ web: 48, default: 42 }),
            fontSize: Platform.select({ web: 15, default: 14 }),
            color: colors.textColor,
            outlineStyle: 'none' as any,
        } as any),
        searchButton: {
            paddingHorizontal: Platform.select({ web: 16, default: 14 }),
            height: Platform.select({ web: 48, default: 42 }),
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 11,
            borderBottomRightRadius: 11,
        },
        searchButtonText: {
            color: '#fff',
            fontWeight: '700' as any,
            fontSize: Platform.select({ web: 14, default: 13 }),
        },
        locationGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            gap: Platform.select({ web: 16, default: 12 }),
            flexWrap: 'wrap',
        },
        locationFieldBlock: {
            flex: 1,
            minWidth: 0,
            paddingRight: Platform.select({ web: 0, default: 4 }),
        },
        locationFieldLabel: {
            fontSize: 13,
            fontWeight: '700' as any,
            color: colors.mutedText,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        coordInputContainer: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
            borderRadius: 8,
            paddingHorizontal: 12,
        },
        coordInput: ({
            height: 44,
            fontSize: 15,
            color: colors.textColor,
            outlineStyle: 'none' as any,
        } as any),
        mapPreviewContainer: {
            height: 220,
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#eee',
            marginBottom: 24,
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f0f0f0',
        },
        mapPreviewFrame: {
            width: '100%',
            height: 400,
            borderWidth: 0,
        },
        emptyMapContainer: {
            height: 220,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#eee',
            borderStyle: 'dashed',
            marginBottom: 24,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
        },
        emptyMapText: {
            marginTop: 8,
            color: colors.mutedText,
            fontSize: 14,
        },
        locationActions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
        },
        locationButtonSecondary: {
            flex: 1,
            minWidth: 0,
            flexBasis: Platform.select({ web: 'auto', default: '48%' }) as any,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: Platform.select({ web: 48, default: 42 }),
            borderWidth: 1,
            borderRadius: 12,
            backgroundColor: 'transparent',
            borderColor: colors.brand,
            paddingHorizontal: Platform.select({ web: 16, default: 12 }),
        },
        locationButtonSecondaryText: {
            color: colors.brand,
            fontWeight: '700' as any,
            fontSize: Platform.select({ web: 15, default: 14 }),
            marginLeft: 8,
        },
        locationButtonPrimary: {
            flex: 1,
            minWidth: 0,
            flexBasis: Platform.select({ web: 'auto', default: '48%' }) as any,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: Platform.select({ web: 48, default: 42 }),
            borderRadius: 12,
            backgroundColor: colors.brand,
            paddingHorizontal: Platform.select({ web: 16, default: 12 }),
        },
        locationButtonPrimaryText: {
            color: '#fff',
            fontWeight: '700' as any,
            fontSize: Platform.select({ web: 15, default: 14 }),
            marginRight: 8,
        },
        locationPickerHint: {
            color: colors.textColor,
            fontSize: 16,
            textAlign: 'left',
            marginBottom: 20,
        },
        mapPreviewTitle: {
            fontSize: 16,
            fontWeight: '700' as any,
            color: colors.textColor,
            marginBottom: 12,
            textAlign: 'left',
        },
        locationNote: {
            color: colors.textColor,
            fontSize: 14,
            textAlign: 'left',
            marginVertical: 10,
        },
        searchResultsContainer: {
            position: 'absolute' as const,
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 2000,
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderRadius: 12,
            maxHeight: 300,
            borderWidth: 1,
            borderColor: isDark ? '#666' : '#ccc',
            overflow: 'hidden' as any,
            ...cardShadow,
        },
        searchResultItem: {
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0',
        },
        searchResultText: {
            color: colors.textColor,
            fontSize: 14,
            lineHeight: 20,
        },

        // ─── Upload & File Items ───────────────────────────────────────────────
        uploadButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 18,
            paddingHorizontal: 16,
            backgroundColor: isDark
                ? 'rgba(44,89,38,0.06)'
                : 'rgba(44,89,38,0.04)',
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: colors.brand,
            borderRadius: 16,
            minHeight: 64,
        },
        uploadButtonText: {
            fontSize: 15,
            fontWeight: '600' as any,
            color: colors.brand,
        },
        documentPreview: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 14,
            backgroundColor: isDark ? 'rgba(44,89,38,0.1)' : '#F0FDF4',
            borderWidth: 1,
            borderColor: colors.success,
            borderRadius: 16,
            minHeight: 60,
        },
        documentName: {
            fontSize: 14,
            fontWeight: '600' as any,
            color: colors.textColor,
            flex: 1,
        },
        changeButton: {
            paddingHorizontal: 12,
            paddingVertical: 7,
            backgroundColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.06)',
            borderRadius: 10,
            flexShrink: 0,
        },
        changeButtonText: {
            fontSize: 13,
            color: colors.textColor,
            fontWeight: '700' as any,
        },

        // ─── Application Form ──────────────────────────────────────────────────
        textArea: {
            height: 110,
            textAlignVertical: 'top',
            paddingTop: 14,
        },
        submitButton: {
            backgroundColor: colors.brand,
            paddingVertical: 18,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 32,
            marginBottom: 12,
            ...elevatedShadow,
        },
        submitButtonDisabled: {
            opacity: 0.45,
            backgroundColor: colors.mutedText,
            ...Platform.select({
                ios: { shadowOpacity: 0 },
                android: { elevation: 0 },
                web: { boxShadow: 'none' } as any,
            }),
        },
        submitButtonText: {
            fontSize: 16,
            fontWeight: '700' as any,
            color: '#fff',
            letterSpacing: 0.5,
        },
        submitButtonTextDisabled: {
            opacity: 0.7,
            color: '#E0E0E0',
        },
        submitNote: {
            fontSize: 13,
            color: colors.mutedText,
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 20,
        },

        // ─── Misc / Legacy ────────────────────────────────────────────────────
        profileCard: {
            marginTop: 24,
            borderRadius: 24,
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : colors.cardColor,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            padding: 24,
            alignItems: 'center',
            gap: 12,
            ...cardShadow,
            overflow: 'hidden',
        },
        formCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : colors.cardColor,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
            overflow: 'hidden',
            ...subtleShadow,
        },
        saveButton: {
            marginTop: 40,
            backgroundColor: colors.brand,
            paddingVertical: 18,
            borderRadius: 18,
            alignItems: 'center',
            ...elevatedShadow,
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