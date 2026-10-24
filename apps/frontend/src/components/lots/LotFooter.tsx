// File: frontend/src/components/lots/LotFooter.tsx
// Component for lot footer.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration LotFooterProps.
export interface LotFooterProps {
    isOwnProduct: boolean;
    isDesktop: boolean;
    containerWidth: string | number;
    colors: any;
    insets: any;
    offerButtonDisabled: boolean;
    offerButtonLabel: string;
    isOfferLoading?: boolean;
    handleOfferPress: () => void;
}

// Exported constant LotFooter.
export const LotFooter = ({
    isOwnProduct,
    isDesktop,
    containerWidth,
    colors,
    insets,
    offerButtonDisabled,
    offerButtonLabel,
    isOfferLoading,
    handleOfferPress
}: LotFooterProps) => {
    if (isOwnProduct) return null;

    const footerWidth = isDesktop ? (containerWidth as number) : undefined;

    return (
        <View style={{
            position: 'absolute',
            bottom: isDesktop ? 24 : 0,
            alignSelf: isDesktop ? 'center' : undefined,
            width: footerWidth,
            left: isDesktop ? undefined : 0,
            right: isDesktop ? undefined : 0,
            backgroundColor: colors.backgroundColor,
            paddingBottom: isDesktop ? 20 : insets.bottom + 8,
            paddingTop: isDesktop ? 20 : 12,
            paddingHorizontal: isDesktop ? 24 : 16,
            borderTopWidth: isDesktop ? 0 : 1,
            borderWidth: isDesktop ? 1 : 0,
            borderColor: colors.mutedText + '25',
            borderRadius: isDesktop ? 24 : 0,
            flexDirection: 'row',
            gap: 16,
            ...(isDesktop ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
                elevation: 10,
            } : {})
        } as const}>
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: isDesktop ? 56 : 50,
                    backgroundColor: offerButtonDisabled ? colors.mutedText + '33' : colors.brand,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                    opacity: offerButtonDisabled ? 0.7 : 1,
                    borderRadius: isDesktop ? 16 : 14,
                }}
                onPress={handleOfferPress}
                disabled={offerButtonDisabled}
            >
                <MaterialIcons name={isOfferLoading ? 'hourglass-empty' : 'thumb-up'} size={isDesktop ? 24 : 20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: isDesktop ? 18 : 16, fontWeight: '800' }}>
                    {offerButtonLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
