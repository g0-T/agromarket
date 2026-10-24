// File: frontend/src/components/settings/SaveButton.tsx
// Button component for save button.

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

// Type declaration SaveButtonProps.
interface SaveButtonProps {
    loading: boolean;
    onSave: () => void;
    colors: any;
    styles: any;
}

// Button component for save actions.
export const SaveButton: React.FC<SaveButtonProps> = ({
    loading,
    onSave,
    styles,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.saveButton,
                loading && styles.saveButtonDisabled,
            ]}
            onPress={onSave}
            disabled={loading}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
        </TouchableOpacity>
    );
};
