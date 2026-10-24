// File: frontend/src/screens/dashboard/HelpScreen.tsx
// Screen component defining a top-level app view.

// app/(tabs)/help.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHelp } from '@/hooks/settings/use-help';
import { HelpHeader } from '@/components/settings/HelpHeader';
import { FaqSection } from '@/components/settings/FaqSection';
import { ContactSection } from '@/components/settings/ContactSection';
import { InputField } from '@/components/ui/InputField';

interface HelpScreenProps {
    onBack: () => void;
}

// Default React component export.
export default function HelpScreen({ onBack }: HelpScreenProps) {
    const router = useRouter();
    const {
        search,
        setSearch,
        filteredFaq,
        isDesktop,
        colors,
        styles,
        handleGoBack,
    } = useHelp(onBack);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={isDesktop ? styles.desktopContainer : { flex: 1 }}>
                <HelpHeader
                    colors={colors}
                    styles={styles}
                    onBack={handleGoBack}
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <InputField
                        icon="search"
                        placeholder="Buscar FAQ"
                        value={search}
                        onChangeText={setSearch}
                        containerStyle={{ marginBottom: 20 }}
                    />

                    <FaqSection
                        filteredFaq={filteredFaq}
                        styles={styles}
                        colors={colors}
                    />

                    <View style={styles.docSection}>
                        <Text style={styles.sectionLabel}>Documentos legales</Text>
                        <TouchableOpacity style={styles.docButton} onPress={() => router.push('/terms')}>
                            <Text style={styles.docButtonText}>Términos y condiciones</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.docButton} onPress={() => router.push('/privacy')}>
                            <Text style={styles.docButtonText}>Política de privacidad</Text>
                        </TouchableOpacity>
                    </View>

                    <ContactSection
                        search={search}
                        styles={styles}
                        colors={colors}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


