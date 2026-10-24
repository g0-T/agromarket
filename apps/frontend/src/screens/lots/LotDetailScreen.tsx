// File: frontend/src/screens/lots/LotDetailScreen.tsx
// Screen component defining a top-level app view.

import React, { useRef } from 'react';
import { View, Text, Animated, useWindowDimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/market/market.styles';
import { MaterialIcons } from '@expo/vector-icons';
import StatPill from '@/components/lots/StatPill';
import InfoRow from '@/components/lots/InfoRow';
import SellerCard from '@/components/lots/SellerCard';
import MediaViewer from '@/components/lots/MediaViewer';
import LotHeader from '@/components/lots/LotHeader';
import LotTitleSection from '@/components/lots/LotTitleSection';
import LotDescription from '@/components/lots/LotDescription';
import { LotFooter } from '@/components/lots/LotFooter';
import { InputField } from '@/components/ui/InputField';
import { LotLoading, LotNotFound } from '@/components/lots/LotStatus';
import { useLotDetail } from '@/hooks/lots/use-lot-detail';

// Default React component export.
export default function LotDetailScreen() {
    const { styles, colors } = useAppTheme(getStyles);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;
    const containerWidth = isDesktop ? Math.min(width - 80, 1120) : '100%';
    const headerPaddingX = insets.left + (isDesktop ? 24 : 16);
    const router = useRouter();

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 180],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const {
        product, loading, saved, isOwnProduct,
        galleryItems, selectedMediaIndex, setSelectedMediaIndex,
        priceConversion, details, stats,
        offerButtonLabel, offerButtonDisabled, isOfferLoading,
        toggleFavorite, handleOfferPress,
        buyerDeliveryAddress, setBuyerDeliveryAddress
    } = useLotDetail();

    if (loading) return <LotLoading colors={colors} />;
    if (!product) return <LotNotFound colors={colors} onBack={() => router.back()} />;

    const galleryProps = {
        galleryItems,
        selectedMediaIndex,
        setSelectedMediaIndex,
        colors,
        onBack: () => router.back(),
        onFavorite: toggleFavorite,
        saved,
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <LotHeader
                opacity={headerOpacity}
                title={product.title}
                colors={colors}
                insets={insets}
                headerPaddingX={headerPaddingX}
                onBack={() => router.back()}
            />

            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: isDesktop ? 160 : 120, alignItems: 'center' }}
            >
                <View style={{ width: containerWidth }}>
                    <MediaViewer {...galleryProps} />

                    <View style={[styles.contentLayout, {
                        gap: isDesktop ? 40 : 24,
                        paddingHorizontal: isDesktop ? 0 : 16,
                        paddingTop: isDesktop ? 40 : 20,
                    }]}>

                        <LotTitleSection
                            product={product}
                            priceConversion={priceConversion}
                            isDesktop={isDesktop}
                            colors={colors}
                        />

                        <View style={[styles.statsRow, { gap: isDesktop ? 16 : 10 }]}>
                            {stats.map(s => (
                                <StatPill key={s.label} {...s} colors={colors} />
                            ))}
                        </View>

                        <LotDescription text={product.description} colors={colors} isDesktop={isDesktop} />

                        <View style={{
                            backgroundColor: colors.cardColor,
                            borderRadius: isDesktop ? 24 : 20,
                            paddingHorizontal: isDesktop ? 24 : 16,
                            borderWidth: 1,
                            borderColor: colors.mutedText + '18',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: isDesktop ? 20 : 14, paddingBottom: isDesktop ? 8 : 4 }}>
                                <MaterialIcons name="info-outline" size={18} color={colors.brand} />
                                <Text style={{ color: colors.textColor, fontSize: isDesktop ? 17 : 15, fontWeight: '800' }}>
                                    Detalles del lote
                                </Text>
                            </View>
                            {details.map((d, i) => (
                                <InfoRow
                                    key={d.label}
                                    {...d}
                                    colors={colors}
                                    last={i === details.length - 1}
                                />
                            ))}
                        </View>

                        <View style={{ width: '100%', gap: 16, marginTop: isDesktop ? 20 : 0 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <MaterialIcons name="storefront" size={18} color={colors.brand} />
                                <Text style={{ color: colors.textColor, fontSize: isDesktop ? 17 : 15, fontWeight: '800' }}>
                                    Vendedor
                                </Text>
                            </View>
                            <SellerCard colors={colors} seller={product.seller} />
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            <LotFooter
                isOwnProduct={isOwnProduct}
                isDesktop={isDesktop}
                containerWidth={containerWidth}
                colors={colors}
                insets={insets}
                offerButtonDisabled={offerButtonDisabled}
                offerButtonLabel={offerButtonLabel}
                isOfferLoading={isOfferLoading}
                handleOfferPress={handleOfferPress}
            />
        </View>
    );
}