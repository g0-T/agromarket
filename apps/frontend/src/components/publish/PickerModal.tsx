// File: frontend/src/components/publish/PickerModal.tsx
// Modal component for picker modal.

import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Type declaration PickerModalProps.
interface PickerModalProps {
    styles: any;
    picker: { visible: boolean; options: string[]; title: string };
    handleSelect: (option: string) => void;
    setPicker: React.Dispatch<React.SetStateAction<{ visible: boolean; options: string[]; field: string; title: string }>>;
}

// Modal component for picker interactions.
export const PickerModal: React.FC<PickerModalProps> = ({
    styles,
    picker,
    handleSelect,
    setPicker,
}) => (
    <Modal visible={picker.visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{picker.title}</Text>
                    <TouchableOpacity onPress={() => setPicker(prev => ({ ...prev, visible: false }))}>
                        <MaterialCommunityIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={picker.options}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={i => i}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.modalOptionText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    </Modal>
);
