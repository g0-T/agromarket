// File: frontend/src/components/settings/FaqSection.tsx
// Section component for faq section.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration FaqItemProps.
interface FaqItemProps {
    item: {
        icon: any;
        question: string;
        answer: string;
    };
    styles: any;
    colors: any;
}

// Exported constant FaqItem.
export const FaqItem: React.FC<FaqItemProps> = ({
    item,
    styles,
    colors,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.faqCard}>
            <TouchableOpacity style={styles.faqHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.75}>
                <View style={styles.faqHeaderLeft}>
                    <View style={styles.faqIcon}>
                        <MaterialIcons name={item.icon} size={18} color={colors.brand} />
                    </View>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                </View>
                <MaterialIcons
                    name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={22}
                    color={colors.mutedText}
                />
            </TouchableOpacity>
            {open && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
        </View>
    );
};

interface FaqSectionProps {
    filteredFaq: any[];
    styles: any;
    colors: any;
}

// Exported constant FaqSection.
export const FaqSection: React.FC<FaqSectionProps> = ({
    filteredFaq,
    styles,
    colors,
}) => {
    return (
        <View>
            <Text style={styles.sectionLabel}>Preguntas Frecuentes</Text>
            {filteredFaq.map((item, i) => (
                <FaqItem key={i} item={item} styles={styles} colors={colors} />
            ))}
            {filteredFaq.length === 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 32, gap: 10 }}>
                    <MaterialIcons name="search-off" size={44} color={colors.mutedText} />
                    <Text style={{ color: colors.mutedText, fontWeight: '600', fontSize: 14 }}>
                        No se encontraron resultados
                    </Text>
                </View>
            )}
        </View>
    );
};
