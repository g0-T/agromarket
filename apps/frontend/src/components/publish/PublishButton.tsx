// File: frontend/src/components/publish/PublishButton.tsx
// Button component for publish button.

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration PublishButtonProps.
interface PublishButtonProps {
    styles: any;
    isFormValid: boolean;
    isSubmitting: boolean;
    publish: () => void;
}

// Button component for publish actions.
export const PublishButton: React.FC<PublishButtonProps> = ({
    styles,
    isFormValid,
    isSubmitting,
    publish,
}) => (
    <TouchableOpacity
        style={[styles.publishButton, (!isFormValid || isSubmitting) && { opacity: 0.5 }]}
        onPress={publish}
        activeOpacity={0.85}
        disabled={!isFormValid || isSubmitting}
    >
        {isSubmitting ? (
            <MaterialIcons name="hourglass-empty" size={20} color="#fff" />
        ) : (
            <MaterialIcons name="send" size={20} color="#fff" />
        )}
        <Text style={styles.buttonText}>
            {isSubmitting ? 'Publicando...' : 'Publicar Lote Ahora'}
        </Text>
    </TouchableOpacity>
);
