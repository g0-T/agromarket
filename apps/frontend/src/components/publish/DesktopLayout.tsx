// File: frontend/src/components/publish/DesktopLayout.tsx
// Component for desktop layout.

import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Section1Multimedia } from '@/components/publish/sections/Section1Multimedia';
import { Section2Info } from '@/components/publish/sections/Section2Info';
import { Section3Breed } from '@/components/publish/sections/Section3Breed';
import { Section4Location } from '@/components/publish/sections/Section4Location';
import { Section5Price } from '@/components/publish/sections/Section5Price';
import { PublishButton } from '@/components/publish/PublishButton';
import { PickerModal } from '@/components/publish/PickerModal';
import { MediaItem } from '@/hooks/publish/use-publish-batch';

// Type declaration DesktopLayoutProps.
interface DesktopLayoutProps {
    styles: any;
    colors: any;
    currentSection: number;
    setCurrentSection: (section: number) => void;
    mediaItems: MediaItem[];
    formData: any;
    picker: any;
    update: (key: string, value: string) => void;
    updateNumber: (key: string, value: string, allowDecimals?: boolean) => void;
    openPicker: (field: string, title: string, options: string[]) => void;
    handleSelect: (option: string) => void;
    priceNum: number;
    companyFee: number;
    netIncome: number;
    isFormValid: boolean;
    isSubmitting: boolean;
    pickImage: () => void;
    publish: () => void;
    setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
    setPicker: React.Dispatch<React.SetStateAction<any>>;
}

// Layout component that structures page sections.
export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
    styles,
    colors,
    currentSection,
    setCurrentSection,
    mediaItems,
    formData,
    picker,
    update,
    updateNumber,
    openPicker,
    handleSelect,
    priceNum,
    companyFee,
    netIncome,
    isFormValid,
    isSubmitting,
    pickImage,
    publish,
    setMediaItems,
    setPicker,
}) => (
    <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Publicar Lote</Text>
                <Text style={styles.headerSubtitle}>Completa los datos para publicar tu lote</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.desktopSectionsGrid}>
                <Section1Multimedia
                    styles={styles}
                    colors={colors}
                    isDesktop={true}
                    mediaItems={mediaItems}
                    pickImage={pickImage}
                    setMediaItems={setMediaItems}
                />
                <Section2Info
                    styles={styles}
                    colors={colors}
                    isDesktop={true}
                    formData={formData}
                    update={update}
                    openPicker={openPicker}
                />
                <Section3Breed
                    styles={styles}
                    colors={colors}
                    isDesktop={true}
                    formData={formData}
                    update={update}
                    updateNumber={updateNumber}
                    openPicker={openPicker}
                />
                <Section4Location
                    styles={styles}
                    colors={colors}
                    isDesktop={true}
                    formData={formData}
                    openPicker={openPicker}
                />
                <Section5Price
                    styles={styles}
                    colors={colors}
                    isDesktop={true}
                    formData={formData}
                    updateNumber={updateNumber}
                    priceNum={priceNum}
                    companyFee={companyFee}
                    netIncome={netIncome}
                />
            </View>
            <PublishButton
                styles={styles}
                isFormValid={isFormValid}
                isSubmitting={isSubmitting}
                publish={publish}
            />
        </ScrollView>
        <PickerModal
            styles={styles}
            picker={picker}
            handleSelect={handleSelect}
            setPicker={setPicker}
        />
    </SafeAreaView>
);
