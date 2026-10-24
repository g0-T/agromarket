// File: frontend/src/components/market/ProductCard.tsx
// Card component for product card.

import React, { useRef, useEffect } from 'react';
import { Animated, InteractionManager } from 'react-native';
import { ListingCard } from '@/components/ui/ListingCard';

// Type declaration ProductCardProps.
interface ProductCardProps {
    item: any;
    index: number;
    offeredIds: number[];
    isDesktop?: boolean;
}

// UI card component for product content.
export const ProductCard = React.memo<ProductCardProps>(({ item, index, offeredIds, isDesktop = false }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        anim.setValue(0);

        if (isDesktop) {
            // Desktop animation with InteractionManager
            const task = InteractionManager.runAfterInteractions(() => {
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 300,
                    delay: Math.min(index * 30, 400),
                    useNativeDriver: true,
                }).start();
            });
            return () => task.cancel();
        } else {
            // Mobile animation
            Animated.timing(anim, {
                toValue: 1,
                duration: 280,
                delay: Math.min(index * 40, 300),
                useNativeDriver: true,
            }).start();
        }
    }, [anim, index, isDesktop]);

    if (isDesktop) {
        return (
            <Animated.View style={{
                flex: 1 / 3,
                opacity: anim,
                transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }
                ],
            }}>
                <ListingCard item={item} offered={offeredIds.includes(item.id)} />
            </Animated.View>
        );
    }

    return (
        <Animated.View style={{
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        }}>
            <ListingCard item={item} offered={offeredIds.includes(item.id)} />
        </Animated.View>
    );
});
