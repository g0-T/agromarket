// File: frontend/src/screens/tabs/BecomeSellerScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBecomeSellerStyles } from '@/styles/screens/auth/become-seller.styles';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { useBecomeSeller } from '@/hooks/seller/use-become-seller';
import { BecomeSellerHeader } from '@/components/seller/BecomeSellerHeader';
import { ApplicationStatus } from '@/components/seller/ApplicationStatus';
import { DocumentUpload } from '@/components/seller/DocumentUpload';
import { ApplicationForm } from '@/components/seller/ApplicationForm';
import { LocationPicker } from '@/components/seller/LocationPicker';

const BecomeSeller = ({ onBack }: { onBack?: () => void }) => {
    const { colors, styles } = useTheme(getBecomeSellerStyles);
    const { width } = useWindowDimensions();

    const isDesktop = width > 768;
    const isSmall = width <= 480;

    const useRowLayout = !isSmall;

    const responsiveRowStyle = useRowLayout
        ? {
            flexDirection: 'row' as const,
            alignItems: 'flex-start' as const,
            paddingVertical: 10,
            gap: isDesktop ? 16 : 12,
            minHeight: isDesktop ? 68 : 60,
        }
        : {
            paddingVertical: 12,
            gap: 8,
        };

    const responsiveLabelStyle = useRowLayout
        ? {
            width: isDesktop ? 110 : 90,
            paddingTop: 14,
        }
        : {
            width: '100%' as const,
            paddingTop: 0,
        };

    const contentPaddingH = isSmall ? 16 : isDesktop ? 40 : 22;

    const {
        reason,
        setReason,
        cedula,
        hierro,
        loading,
        application,
        loadingApplication,
        farmLocation,
        showLocationPicker,
        pickDocument,
        shareFarmLocation,
        handleLocationSelect,
        closeLocationPicker,
        submitApplication,
    } = useBecomeSeller();

    const canSubmit = cedula !== null && hierro !== null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={isDesktop ? styles.desktopContainer : { flex: 1 }}>
                <BecomeSellerHeader
                    colors={colors}
                    styles={styles}
                    onBack={onBack ?? (() => { })}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        isDesktop && { paddingHorizontal: 0 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            styles.content,
                            { paddingHorizontal: contentPaddingH },
                            isDesktop && styles.contentDesktop,
                        ]}
                    >
                        <ApplicationStatus
                            application={application}
                            loadingApplication={loadingApplication}
                            colors={colors}
                            styles={styles}
                        />

                        {(!application || application.status === 'rejected') && (
                            <>
                                <DocumentUpload
                                    cedula={cedula}
                                    hierro={hierro}
                                    farmLocation={farmLocation}
                                    onPickDocument={pickDocument}
                                    onShareLocation={shareFarmLocation}
                                    colors={colors}
                                    styles={styles}
                                    responsiveRowStyle={responsiveRowStyle}
                                    responsiveLabelStyle={responsiveLabelStyle}
                                />

                                <ApplicationForm
                                    reason={reason}
                                    setReason={setReason}
                                    loading={loading}
                                    onSubmit={submitApplication}
                                    canSubmit={canSubmit}
                                    colors={colors}
                                    styles={styles}
                                    responsiveRowStyle={responsiveRowStyle}
                                    responsiveLabelStyle={responsiveLabelStyle}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>

            {showLocationPicker && (
                <LocationPicker
                    initialLocation={farmLocation.lat && farmLocation.lng ? {
                        lat: farmLocation.lat,
                        lng: farmLocation.lng,
                        address: farmLocation.address
                    } : undefined}
                    onLocationSelect={handleLocationSelect}
                    onClose={closeLocationPicker}
                    colors={colors}
                    styles={styles}
                />
            )}
        </SafeAreaView>
    );
};

// Default export for this module.
export default BecomeSeller;