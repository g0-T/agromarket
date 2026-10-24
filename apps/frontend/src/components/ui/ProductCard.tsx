// File: frontend/src/components/ui/ProductCard.tsx
// Card component for product card.

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '@/services/product.service';
import { useRouter } from 'expo-router';
import { formatCurrency } from '@/utils/currency';

// Type declaration Props.
interface Props {
    item: Product;
    style?: any;
}

// UI card component for product content.
export const ProductCard: React.FC<Props> = ({ item, style }) => {
    const { colors } = useAppTheme(() => ({}));
    const router = useRouter();

    const coverImage = item.img && !/\.(mp4|mov|webm|mkv|avi|ogg)(\?.*)?$/i.test(item.img)
        ? item.img
        : item.attachments?.find(att => att.mimeType?.startsWith('image/'))?.url;

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(lots)/${item.id}` as any)}
            style={[{ backgroundColor: colors.cardColor, borderRadius: 12, padding: 14, marginBottom: 12 }, style]}
        >
            {coverImage ? (
                <Image source={{ uri: coverImage }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 10 }} />
            ) : item.img ? (
                <View style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 10, backgroundColor: colors.borderColor, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="videocam" size={28} color={colors.mutedText} />
                </View>
            ) : null}
            <Text style={{ color: colors.textColor, fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: colors.mutedText, fontSize: 13, marginTop: 4 }}>{item.category}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Text style={{ color: colors.brand, fontSize: 15, fontWeight: '800' }}>{formatCurrency(item.price, item.currency || 'USD')}</Text>
            </View>
        </TouchableOpacity>
    );
};
