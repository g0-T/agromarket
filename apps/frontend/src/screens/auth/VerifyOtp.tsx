// File: frontend/src/screens/auth/VerifyOtp.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import VerifyOtpForm from '@/components/auth/VerifyOtpForm';

const VerifyOTPScreen = () => {
    const params = useLocalSearchParams();

    const email = params.email as string;
    const phone = params.phone as string;
    const password = params.password as string;

    const isPhoneMode = Boolean(phone);
    const identity = isPhoneMode ? phone : (email || '');
    const mode = isPhoneMode ? 'phone' : 'email';

    return (
        <VerifyOtpForm
            identity={identity}
            mode={mode}
            title={isPhoneMode ? "Verificación Teléfono" : "Verificación OTP"}
            subtitlePrefix="Código enviado a"
            successRoute={isPhoneMode ? "/dashboard/personal-data" : "/"}
            cancelRoute={isPhoneMode ? "back" : "/login"}
            useBackOnSuccess={isPhoneMode}
            password={password}
        />
    );
};

// Default export for this module.
export default VerifyOTPScreen;