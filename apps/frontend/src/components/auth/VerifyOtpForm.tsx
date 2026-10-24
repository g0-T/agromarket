// File: frontend/src/components/auth/VerifyOtpForm.tsx
// Form component for verify otp form.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/auth/auth.styles';
import authService from '@/services/auth.service';
import { useAuth } from '@/hooks/use-auth';
import logger from '@/utils/logger';
import { useUserStore } from '@/store/use-user.store';

// Type declaration VerifyOtpFormProps.
type VerifyOtpFormProps = {
    identity: string;
    mode: 'email' | 'phone';
    title: string;
    subtitlePrefix: string;
    successRoute: string;
    cancelRoute?: string;
    useBackOnSuccess?: boolean;
    password?: string;
};

// Component for verify otp form.
const VerifyOtpForm = ({
    identity,
    mode,
    title,
    subtitlePrefix,
    successRoute,
    cancelRoute,
    useBackOnSuccess = false, password, }: VerifyOtpFormProps) => {
    const { colors, styles } = useTheme(getStyles);
    const router = useRouter();
    const { user, refreshUser, updateUser } = useAuth();
    const { updateUserProfile } = useUserStore();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { width } = useWindowDimensions();
    const isDesktop = width >= 900;

    const handleConfirm = async () => {
        if (otp.length !== 6) {
            setErrorMessage('Ingresa el código de 6 dígitos.');
            return;
        }

        if (submitted) {
            logger.warn('[FRONTEND VERIFY FORM] Submit blocked, already submitted');
            return;
        }

        logger.info(`[FRONTEND VERIFY FORM] Starting OTP verification: ${otp} for ${identity} (${mode})`);
        setLoading(true);
        setErrorMessage('');

        try {
            if (mode === 'phone') {
                await authService.verifyPhoneOtp(identity, otp);
                updateUserProfile({ isPhoneVerified: true });
                setSubmitted(true);
            } else {
                const verifyResult = await authService.verifyOtp(identity, otp);

                if (password) {
                    const loginResult = await authService.login({ email: identity, password }) as any;
                    const userData = loginResult?.user || loginResult?.session?.user;

                    if (userData) {
                        setSubmitted(true);
                        updateUser({ ...userData, emailVerified: true });

                        setTimeout(() => {
                            router.replace('/(tabs)');
                        }, 100);
                        return;
                    }
                }
            }
        } catch (error: any) {
            logger.error('[FRONTEND VERIFY FORM] Verification error:', { error });
            setSubmitted(false);

            const serverMessage = error?.response?.data?.message;
            const normalized = typeof serverMessage === 'string' ? serverMessage.toLowerCase() : '';

            if (normalized.includes('invalid otp') || normalized.includes('otp inválido') || normalized.includes('código inválido') || normalized.includes('codigo invalido')) {
                setErrorMessage('El código es incorrecto. Verifica los 6 dígitos e intenta de nuevo.');
            } else if (normalized.includes('expired') || normalized.includes('expirado')) {
                setErrorMessage('El código expiró. Solicita uno nuevo e inténtalo de nuevo.');
            } else if (serverMessage) {
                setErrorMessage(serverMessage);
            } else {
                setErrorMessage('El código es incorrecto o expiró. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (cancelRoute === 'back' && router.canGoBack()) {
            router.back();
            return;
        }
        if (cancelRoute) {
            router.push(cancelRoute);
        }
    };

    const cardStyle = isDesktop
        ? styles.cardDesktop
        : {
            width: '100%',
            backgroundColor: colors.cardColor,
            padding: 28,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.borderColor,
        };

    return (
        <View style={[styles.container, { flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 20, paddingVertical: 24 }]}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: isDesktop ? 560 : '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={cardStyle}>
                        <Text style={[styles.mainTitle, { marginBottom: 8, fontSize: isDesktop ? 36 : 30 }]}>{title}</Text>
                        <Text style={[styles.subtitle, { marginBottom: 24, fontSize: isDesktop ? 13 : 11, letterSpacing: 3 }]}>
                            {subtitlePrefix} {identity}
                        </Text>

                        <TextInput
                            value={otp}
                            onChangeText={text => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={{
                                width: '100%',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: colors.brand,
                                backgroundColor: colors.backgroundColor,
                                color: colors.textColor,
                                fontSize: 22,
                                textAlign: 'center',
                                letterSpacing: 14,
                            }}
                            placeholder="------"
                            placeholderTextColor={colors.mutedText}
                        />

                        {errorMessage ? (
                            <Text style={{ color: 'tomato', marginTop: 16, textAlign: 'center', lineHeight: 22 }}>
                                {errorMessage}
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={loading}
                            style={[styles.submitBtn, { marginTop: 28, opacity: loading ? 0.65 : 1 }]}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Confirmar</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCancel} style={{ marginTop: 16 }}>
                            <Text style={{ color: '#AAAAAA', textAlign: 'center', fontSize: 14 }}>
                                {cancelRoute === 'back' ? 'Volver' : 'Volver a iniciar sesión'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

// Default export for this module.
export default VerifyOtpForm;
