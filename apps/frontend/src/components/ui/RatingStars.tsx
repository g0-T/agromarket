// File: frontend/src/components/ui/RatingStars.tsx
// Component for rating stars.

import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration Props.
interface Props {
    rating: number;
    size?: number;
}

// Exported constant RatingStars.
export const RatingStars = ({ rating, size = 14 }: Props) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
            <MaterialIcons
                key={i}
                name={
                    i <= Math.floor(rating)
                        ? 'star'
                        : i - rating < 1
                            ? 'star-half'
                            : 'star-border'
                }
                size={size}
                color="#C5A059"
            />
        ))}
    </View>
);
