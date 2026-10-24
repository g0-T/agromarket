// File: frontend/src/screens/dashboard/PersonalDataScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getPersonalDataStyles } from '@/styles/screens/dashboard/personal-data.styles';
import { usePersonalData } from '@/hooks/settings/use-personal-data';
import { PersonalDataHeader } from '@/components/settings/PersonalDataHeader';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { PhoneSection } from '@/components/settings/PhoneSection';

interface PersonalDataScreenProps {
    onBack: () => void;
}

// Default React component export.
export default function PersonalDataScreen({ onBack }: PersonalDataScreenProps) {
    const { colors, styles } = useTheme(getPersonalDataStyles);
    const { width } = useWindowDimensions();

    const isDesktop = width > 768;
    const isSmall = width <= 480;

    // Switch to side-by-side (row) layout on medium screens and up
    const useRowLayout = !isSmall;

    const responsiveRowStyle = useRowLayout
        ? {
            flexDirection: 'row' as const,
            alignItems: 'flex-start' as const,
            paddingHorizontal: isDesktop ? 24 : 18,
            paddingVertical: 10,
            gap: isDesktop ? 16 : 12,
            minHeight: isDesktop ? 68 : 60,
        }
        : {
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 10,
        };

    const responsiveLabelStyle = useRowLayout
        ? {
            width: isDesktop ? 120 : 100,
            paddingTop: 12,
        }
        : {
            width: '100%' as const,
            paddingTop: 0,
        };

    const contentPaddingH = isSmall ? 16 : isDesktop ? 40 : 22;

    const {
        formData,
        phoneCountryCode,
        phoneAreaCode,
        phoneNumber,
        isPhoneDropdownOpen,
        updateFormData,
        setPhoneCountryCode,
        setPhoneAreaCode,
        setPhoneNumber,
        setIsPhoneDropdownOpen,
        phoneLoading,
        isPhoneVerified,
        codeSent,
        sendVerificationCode,
        verifyPhoneCode,
        phoneAreaCodesByCountry,
    } = usePersonalData();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={isDesktop ? styles.desktopContainer : { flex: 1 }}>

                <PersonalDataHeader
                    colors={colors}
                    styles={styles}
                    isDesktop={isDesktop}
                    onBack={onBack}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={[
                            styles.content,
                            { paddingHorizontal: contentPaddingH },
                            isDesktop && styles.contentDesktop,
                            { overflow: 'visible' },
                        ]}
                    >
                        <View style={{ zIndex: 10 }}>
                            <ProfileSection
                                formData={formData}
                                onUpdateFormData={updateFormData}
                                colors={colors}
                                styles={styles}
                                responsiveRowStyle={responsiveRowStyle}
                                responsiveLabelStyle={responsiveLabelStyle}
                            />
                        </View>

                        <View style={{ zIndex: 50, position: 'relative' }}>
                            <PhoneSection
                                phoneCountryCode={phoneCountryCode}
                                phoneAreaCode={phoneAreaCode}
                                phoneNumber={phoneNumber}
                                isPhoneDropdownOpen={isPhoneDropdownOpen}
                                isPhoneVerified={isPhoneVerified}
                                phoneLoading={phoneLoading}
                                phoneAreaCodesByCountry={phoneAreaCodesByCountry}
                                onSetPhoneCountryCode={setPhoneCountryCode}
                                onSetPhoneAreaCode={setPhoneAreaCode}
                                onSetPhoneNumber={setPhoneNumber}
                                onSetIsPhoneDropdownOpen={setIsPhoneDropdownOpen}
                                onSendVerificationCode={sendVerificationCode}
                                onVerifyPhoneCode={verifyPhoneCode}
                                codeSent={codeSent}
                                isDesktop={isDesktop}
                                colors={colors}
                                styles={styles}
                                responsiveRowStyle={responsiveRowStyle}
                                responsiveLabelStyle={responsiveLabelStyle}
                            />
                        </View>

                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}