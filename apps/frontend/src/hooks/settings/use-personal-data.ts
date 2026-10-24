// File: frontend/src/hooks/settings/use-personal-data.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useUserStore } from '@/store/use-user.store';
import authService from '@/services/auth.service';
import Toast from 'react-native-toast-message';
import logger from '@/utils/logger';

const phoneAreaCodesByCountry: Record<string, string[]> = {
    '+58': ['424', '414', '422', '412', '416', '426'],
};

const parsePhoneParts = (phone?: string | null) => {
    const normalized = (phone || '').replace(/\D/g, '');
    if (!normalized) {
        return { countryCode: '+58', areaCode: '424', subscriberNumber: '' };
    }

    if (normalized.startsWith('58') && normalized.length >= 11) {
        return {
            countryCode: '+58',
            areaCode: normalized.slice(2, 5),
            subscriberNumber: normalized.slice(5, 12),
        };
    }

    return {
        countryCode: '+58',
        areaCode: normalized.slice(0, 3) || '424',
        subscriberNumber: normalized.slice(-7),
    };
};

// Exported constant usePersonalData.
export const usePersonalData = () => {
    const { user, updateUserProfile } = useUserStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [phoneCountryCode, setPhoneCountryCode] = useState('+58');
    const [phoneAreaCode, setPhoneAreaCode] = useState('424');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [loading, setLoading] = useState(false);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const currentPhone = `${phoneCountryCode}${phoneAreaCode}${phoneNumber}`;
    const normalizedCurrentPhone = currentPhone.replace(/\D/g, '');
    const normalizedStoredPhone = (user?.phone || '').replace(/\D/g, '');
    const isPhoneVerified = Boolean(
        user?.isPhoneVerified && normalizedCurrentPhone === normalizedStoredPhone
    );

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });

            const parsed = parsePhoneParts(user.phone);
            setPhoneCountryCode(parsed.countryCode);
            setPhoneAreaCode(parsed.areaCode || '424');
            setPhoneNumber(parsed.subscriberNumber);
            setCodeSent(false);
        }
    }, [user]);

    useEffect(() => {
        if (normalizedCurrentPhone !== normalizedStoredPhone) {
            setCodeSent(false);
        }
    }, [normalizedCurrentPhone, normalizedStoredPhone]);

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const sendVerificationCode = async () => {
        if (phoneLoading) return;

        if (!currentPhone || currentPhone.length < 11) {
            Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
            return;
        }

        setPhoneLoading(true);
        try {
            await authService.sendPhoneOtp(currentPhone);
            setCodeSent(true);
            Toast.show({
                type: 'success',
                text1: 'Código enviado',
                text2: 'Revisa tu teléfono para el código de verificación',
            });
        } catch (error: any) {
            logger.error(error, { context: 'sendVerificationCode' });
            const message = error.response?.data?.message || error.message || 'No se pudo enviar el código';
            Alert.alert('Error', message);
        } finally {
            setPhoneLoading(false);
        }
    };

    const verifyPhoneCode = async (code: string) => {
        if (!code || code.length !== 6) {
            Alert.alert('Error', 'El código debe tener 6 dígitos');
            return;
        }

        setPhoneLoading(true);
        try {
            const result = await authService.verifyPhoneOtp(currentPhone, code);

            if (result.success) {
                await updateUserProfile({ phone: currentPhone, isPhoneVerified: true });
                Toast.show({
                    type: 'success',
                    text1: 'Teléfono verificado',
                    text2: 'Tu número de teléfono ha sido verificado exitosamente',
                });
            } else {
                Alert.alert('Error', 'Código incorrecto');
            }
        } catch (error: any) {
            logger.error(error, { context: 'verifyPhoneCode' });
            const message = error.response?.data?.message || error.message || 'No se pudo verificar el código';
            Alert.alert('Error', message);
        } finally {
            setPhoneLoading(false);
        }
    };

    const saveProfile = async () => {
        if (loading) return;

        const fullPhone = currentPhone;

        // Validate required fields
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        if (!formData.email.trim()) {
            Alert.alert('Error', 'El email es obligatorio');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                name: formData.name.trim(),
                email: formData.email.trim(),
            };

            const normalizedStoredPhone = (user?.phone || '').replace(/\D/g, '');
            const normalizedFullPhone = fullPhone.replace(/\D/g, '');

            // Only update phone if it changed
            if (normalizedFullPhone !== normalizedStoredPhone) {
                updateData.phone = fullPhone;
                updateData.isPhoneVerified = false; // Reset verification when phone changes
            }

            await updateUserProfile(updateData);

            Toast.show({
                type: 'success',
                text1: 'Perfil actualizado',
                text2: 'Tu información ha sido guardada exitosamente',
            });
        } catch (error: any) {
            logger.error(error, { context: 'updateProfile' });
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        phoneCountryCode,
        phoneAreaCode,
        phoneNumber,
        isPhoneDropdownOpen,
        codeSent,
        updateFormData,
        setPhoneCountryCode,
        setPhoneAreaCode,
        setPhoneNumber,
        setIsPhoneDropdownOpen,
        loading,
        phoneLoading,
        isPhoneVerified,
        sendVerificationCode,
        verifyPhoneCode,
        saveProfile,
        phoneAreaCodesByCountry,
    };
};