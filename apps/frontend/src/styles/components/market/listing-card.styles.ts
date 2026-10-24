// File: frontend/src/styles/components/market/listing-card.styles.ts
// UI component file for the frontend application.

import { StyleSheet, Platform } from 'react-native';
import { getThemeColors } from '@/constants/theme';

// Exported constant getCardStyles.
export const getCardStyles = (colors: ReturnType<typeof getThemeColors>) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundColor,
      borderRadius: 12,
      marginBottom: 12,
      marginHorizontal: 8,
      overflow: 'hidden',
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      ...Platform.select({
        android: { elevation: 2 },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
        },
        web: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        }
      })
    },
    image: {
      width: '100%',
      height: 150,
    },
    videoPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.borderColor,
    },
    badgeContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      flexDirection: 'row',
      gap: 5,
    },
    verifiedBadge: {
      backgroundColor: colors.brand,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    verifiedText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    content: {
      padding: 12,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    titleContainer: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      color: colors.textColor,
      fontWeight: '600',
      fontSize: 16,
      marginBottom: 4,
    },
    location: {
      color: colors.mutedText,
      fontSize: 12,
    },
    priceContainer: { 
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textColor,
      textAlign: 'right',
    },
    priceUnit: {
      fontSize: 12,
      fontWeight: 'normal',
      color: colors.mutedText,
    },
    priceBs: {
      fontSize: 11,
      color: colors.mutedText,
    },
    statsRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
      marginVertical: 12,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 9, fontWeight: 'bold', color: colors.mutedText, textTransform: 'uppercase' },
    statValue: { fontSize: 13, fontWeight: '600', color: colors.textColor },
    statValueCondition: { 
      fontSize: 13,
      fontWeight: '600',
      color: colors.brand,
    },
    statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.borderColor },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4,
    },
    submitBtn: {
      flex: 1,
      backgroundColor: colors.brand,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitBtnText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    shareBtn: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
};