// File: frontend/src/components/lots/SellerCard.tsx
// Card component for seller card.

import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getThemeColors } from '@/constants/theme';

// Type declaration ThemeColors.
type ThemeColors = ReturnType<typeof getThemeColors>;

type Seller = {
    id: string;
    name?: string;
    image?: string;
    phone?: string;
    email?: string;
    role?: string;
};

// Component for seller card.
const SellerCard = ({ colors, seller }: { colors: ThemeColors; seller?: Seller }) => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;

    const sellerName = seller?.name || 'Vendedor';
    const sellerVerified = seller?.role === 'seller';
    const sellerLabel = sellerVerified ? '✓ VERIFICADO' : 'SIN VERIFICAR';
    const sellerLabelBackground = sellerVerified ? colors.brand + '20' : colors.mutedText + '12';
    const sellerLabelColor = sellerVerified ? colors.brand : colors.mutedText;

    return (
        <View style={{
            backgroundColor: colors.cardColor,
            borderRadius: isDesktop ? 24 : 20,
            padding: isDesktop ? 24 : 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: isDesktop ? 18 : 14,
            borderWidth: 1,
            borderColor: colors.mutedText + '20',
        }}>
            {seller?.image ? (
                <Image source={{ uri: seller.image }} style={{ width: isDesktop ? 64 : 56, height: isDesktop ? 64 : 56, borderRadius: 32 }} />
            ) : (
                <View style={{
                    width: isDesktop ? 64 : 56, height: isDesktop ? 64 : 56, borderRadius: 32,
                    backgroundColor: colors.brand + '20',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <MaterialIcons name="person" size={isDesktop ? 32 : 28} color={colors.brand} />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Text style={{ color: colors.textColor, fontSize: isDesktop ? 17 : 15, fontWeight: '800' }}>{sellerName}</Text>
                    <View style={{
                        backgroundColor: sellerLabelBackground,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                    }}>
                        <Text style={{ color: sellerLabelColor, fontSize: 10, fontWeight: '700' }}>{sellerLabel}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

// Default export for this module.
export default SellerCard;
