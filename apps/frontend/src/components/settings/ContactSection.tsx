// File: frontend/src/components/settings/ContactSection.tsx
// Section component for contact section.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration ContactSectionProps.
interface ContactSectionProps {
    search: string;
    styles: any;
    colors: any;
}

// Exported constant ContactSection.
export const ContactSection: React.FC<ContactSectionProps> = ({
    search,
    styles,
    colors,
}) => {
    if (search) return null;

    return (
        <View>
            <Text style={styles.sectionLabel}>Canales de contacto</Text>
            <View style={styles.contactRow}>
                {[
                    { icon: 'email' as const, label: 'Email', sub: 'soporte@agromarket.ve' },
                    { icon: 'phone' as const, label: 'Teléfono', sub: '+58 412-0000000' },
                ].map(c => (
                    <TouchableOpacity key={c.label} style={styles.contactCard} activeOpacity={0.8}>
                        <View style={styles.contactIcon}>
                            <MaterialIcons name={c.icon} size={22} color={colors.brand} />
                        </View>
                        <Text style={styles.contactLabel}>{c.label}</Text>
                        <Text style={styles.contactSub}>{c.sub}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
