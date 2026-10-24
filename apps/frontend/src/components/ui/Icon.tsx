// File: frontend/src/components/ui/Icon.tsx
// Component for icon.

import React from 'react';
import { View, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration Props.
interface Props {
    name: string;
    size: number;
    color: string;
    style?: any;
}

// Exported constant Icon.
export const Icon = ({ name, size, color, style }: Props) => {
    if (Platform.OS === 'web') {
        return (
            <View style={[
                { 
                    width: size, 
                    height: size, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    display: 'inline-flex'
                }, 
                style
            ]}>
                <MaterialIcons name={name as any} size={size} color={color} />
            </View>
        );
    }

    return <MaterialIcons name={name as any} size={size} color={color} style={style} />;
};
