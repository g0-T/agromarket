// File: frontend/src/components/ui/ListingCard.tsx
// List component for listing card.

import React, { memo, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import type { MarketItem } from '@/types/market';
import { formatBS, formatCurrency, convertToVES } from '@/utils/currency';
import logger from '@/utils/logger';
import { getCardStyles } from '@/styles/components/market/listing-card.styles';
import { useCurrency } from '@/context/CurrencyContext';
import transactionService from '@/services/transaction.service';

// Type declaration ListingCardProps.
interface ListingCardProps {
    item: MarketItem;
    offered?: boolean;
}

// Component for listing card component.
const ListingCardComponent = ({ item, offered = false }: ListingCardProps) => {
    const { colors } = useTheme();
    const { bcvRate } = useCurrency();
    const styles = useMemo(() => getCardStyles(colors), [colors]);
    const router = useRouter();

    const coverImage = useMemo(() => {
        if (!item.img) return null;
        const isVideoUrl = /\.(mp4|mov|webm|mkv|avi|ogg)(\?.*)?$/i.test(item.img);
        if (!isVideoUrl) return item.img;
        return item.attachments?.find(att => att.mimeType?.startsWith('image/'))?.url || null;
    }, [item.img, item.attachments]);

    const priceInBs = useMemo(() => {
        if (!bcvRate || bcvRate === 0) return 'Cargando...';

        const totalBs = item.price * bcvRate;

        return formatBS(totalBs);
    }, [item.price, bcvRate]);

    const formattedPrice = formatCurrency(item.price, item.currency || 'VES');

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/(lots)/${item.id}`)}
            style={styles.card}
        >
            <View>
                {coverImage ? (
                    <Image
                        source={{ uri: coverImage }}
                        style={styles.image}
                        resizeMode="cover"
                        fadeDuration={300}
                    />
                ) : (
                    <View style={[styles.image, styles.videoPlaceholder]}>
                        <MaterialIcons name="videocam" size={34} color={colors.mutedText} />
                    </View>
                )}
                <View style={styles.badgeContainer}>
                    {item.verified && (
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={12} color="#ffffff" />
                            <Text style={styles.verifiedText}>VERIFICADO</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.rowBetween}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            {formattedPrice}
                        </Text>
                        <Text style={styles.priceBs}>≈ {priceInBs} Bs.</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Peso Prom.</Text>
                        <Text style={styles.statValue}>{item.weight}</Text>
                    </View>
                    <View style={[styles.statItem, styles.statBorder]}>
                        <Text style={styles.statLabel}>Edad</Text>
                        <Text style={styles.statValue}>{item.age}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Condición</Text>
                        <Text style={styles.statValueCondition}>{item.condition}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.submitBtn, offered && { opacity: 0.5 }]}
                        activeOpacity={0.7}
                        onPress={async () => {
                            if (offered) return;
                            try {
                                await transactionService.createTransaction({
                                    productId: item.id,
                                    amount: item.price,
                                    currency: item.currency || 'VES',
                                });
                                Alert.alert('Éxito', 'Transacción creada');
                                router.push('/Transactions?tab=purchases');
                            } catch (err) {
                                logger.warn('create tx error', { error: err });
                                const message = (err as any)?.response?.data?.message;
                                Alert.alert('Error', message || 'No se pudo crear la transacción');
                            }
                        }}
                    >
                        <Text style={styles.submitBtnText}>{offered ? 'OFERTA ENVIADA' : 'OFERTAR'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const arePropsEqual = (prev: ListingCardProps, next: ListingCardProps) => {
    return prev.item.id === next.item.id &&
        prev.item.price === next.item.price &&
        prev.item.verified === next.item.verified &&
        prev.offered === next.offered;
};

// UI card component for listing content.
export const ListingCard = memo(ListingCardComponent, arePropsEqual);
