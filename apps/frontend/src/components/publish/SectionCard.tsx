// File: frontend/src/components/publish/SectionCard.tsx
// Card component for section card.

import React from 'react';
import { View } from 'react-native';

// Component for section card.
const SectionCard = ({ children, style, styles }: { children: React.ReactNode; style?: any; styles: any }) => (
    <View style={[styles.sectionCard, style]}>{children}</View>
);

// Default export for this module.
export default SectionCard;
