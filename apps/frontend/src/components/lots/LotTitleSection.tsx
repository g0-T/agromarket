// File: frontend/src/components/lots/LotTitleSection.tsx
// Section component for lot title section.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/currency';
import { Product } from '@/services/product.service';

// Type declaration LotTitleSectionProps.
interface LotTitleSectionProps {
    product: Product;
    priceConversion: { label: string; value: string };
    isDesktop: boolean;
    colors: any;
}

// Component for lot title section.
const LotTitleSection: React.FC<LotTitleSectionProps> = ({ product, priceConversion, isDesktop, colors }) => (
    <View style={{ width: '100%', gap: isDesktop ? 28 : 20 }}>
        <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {product.category && (
                    <View style={{
                        backgroundColor: colors.brand + '18',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}>
                        <Text style={{ color: colors.brand, fontSize: 11, fontWeight: '700' }}>
                            {product.category.toUpperCase()}
                        </Text>
                    </View>
                )}
                {product.breed && (
                    <View style={{
                        backgroundColor: colors.mutedText + '18',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}>
                        <Text style={{ color: colors.mutedText, fontSize: 11, fontWeight: '700' }}>
                            {product.breed.toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={{ color: colors.textColor, fontSize: isDesktop ? 36 : 28, fontWeight: '900', lineHeight: isDesktop ? 42 : 34 }}>
                {product.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="location-on" size={15} color={colors.mutedText} />
                <Text style={{ color: colors.mutedText, fontSize: 13, fontWeight: '500' }}>
                    {product.location || ''}
                </Text>
            </View>
        </View>

        <View style={{
            backgroundColor: colors.brand,
            borderRadius: isDesktop ? 24 : 20,
            padding: isDesktop ? 24 : 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <View>
                <Text style={{ color: '#fff', fontSize: isDesktop ? 36 : 28, fontWeight: '900', letterSpacing: -0.5 }}>
                    {formatCurrency(Number(product.price), product.currency || 'USD')}
                </Text>
                {priceConversion.value ? (
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: isDesktop ? 14 : 12, marginTop: 2 }}>
                        {priceConversion.label} {priceConversion.value}
                    </Text>
                ) : null}
            </View>
            <View style={{
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 16,
                padding: 14,
            }}>
                <MaterialIcons name="attach-money" size={isDesktop ? 38 : 32} color="#fff" />
            </View>
        </View>
    </View>
);

// Default export for this module.
export default LotTitleSection;
