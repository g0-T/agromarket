// File: frontend/src/screens/publish/PublishBatchScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/publish/publish-batch.styles';
import { usePublishBatch } from '@/hooks/publish/use-publish-batch';
import { DesktopLayout } from '@/components/publish/DesktopLayout';
import { MobileLayout } from '@/components/publish/MobileLayout';

const PublishBatch = () => {
    const { theme, colors, styles } = useTheme(getStyles);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        currentSection,
        setCurrentSection,
        isSubmitting,
        mediaItems,
        formData,
        picker,
        openPicker,
        handleSelect,
        update,
        updateNumber,
        handleCurrencyChange,
        priceNum,
        companyFee,
        netIncome,
        isFormValid,
        pickImage,
        publish,
        setMediaItems,
        setPicker,
    } = usePublishBatch();

    if (isDesktop) {
        return (
            <DesktopLayout
                styles={styles}
                colors={colors}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                mediaItems={mediaItems}
                formData={formData}
                picker={picker}
                update={update}
                updateNumber={updateNumber}
                openPicker={openPicker}
                handleSelect={handleSelect}
                priceNum={priceNum}
                companyFee={companyFee}
                netIncome={netIncome}
                isFormValid={isFormValid}
                isSubmitting={isSubmitting}
                pickImage={pickImage}
                publish={publish}
                setMediaItems={setMediaItems}
                setPicker={setPicker}
            />
        );
    }

    return (
        <MobileLayout
            styles={styles}
            colors={colors}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            mediaItems={mediaItems}
            formData={formData}
            picker={picker}
            update={update}
            updateNumber={updateNumber}
            openPicker={openPicker}
            handleSelect={handleSelect}
            priceNum={priceNum}
            companyFee={companyFee}
            netIncome={netIncome}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            pickImage={pickImage}
            publish={publish}
            setMediaItems={setMediaItems}
            setPicker={setPicker}
        />
    );
};

// Default export for this module.
export default PublishBatch;