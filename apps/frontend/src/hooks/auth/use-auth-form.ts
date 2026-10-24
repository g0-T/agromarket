// File: frontend/src/hooks/auth/use-auth-form.ts
// Custom hook logic for React state and side effects.

import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/auth/auth.styles';
import authService from '@/services/auth.service';
import { useAuth } from '@/hooks/use-auth';
import logger from '@/utils/logger';

// Type declaration AuthFormTab.
export type AuthFormTab = 'login' | 'signup';

// Type declaration UseAuthFormResult.
export type UseAuthFormResult = {
    activeTab: AuthFormTab;
    setActiveTab: (value: AuthFormTab) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    phoneCountryCode: string;
    setPhoneCountryCode: (value: string) => void;
    phoneAreaCode: string;
    setPhoneAreaCode: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    loading: boolean;
    errorMessage: string;
    handleMainButtonPress: () => Promise<void>;
    isDesktop: boolean;
    colors: ReturnType<typeof useTheme>['colors'];
    styles: ReturnType<typeof getStyles>;
};

// Form component for useAuth input collection.
export const useAuthForm = (): UseAuthFormResult => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const { colors, styles } = useTheme(getStyles);
    const router = useRouter();
    const { signIn, signUp } = useAuth();

    const [activeTab, setActiveTab] = useState<AuthFormTab>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('+58');
    const [phoneAreaCode, setPhoneAreaCode] = useState('424');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setErrorMessage('');
    }, [activeTab]);

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = email.trim().toLowerCase();
        const maxEmailLength = 254;
        const maxPasswordLength = 20;
        const maxNameLength = 100;

        if (!emailValue || emailValue.length > maxEmailLength || !emailRegex.test(emailValue)) {
            setErrorMessage('Por favor, ingresa un correo electrónico válido.');
            return false;
        }

        if (!password || password.length < 6 || password.length > maxPasswordLength) {
            setErrorMessage('La contraseña debe tener entre 6 y 20 caracteres.');
            return false;
        }

        if (activeTab === 'signup') {
            const trimmedName = name.trim();
            if (!trimmedName) {
                setErrorMessage('El nombre completo es obligatorio.');
                return false;
            }
            if (trimmedName.length > maxNameLength) {
                setErrorMessage('El nombre no puede tener más de 100 caracteres.');
                return false;
            }
            if (phoneNumber && !/^\d{7}$/.test(phoneNumber)) {
                setErrorMessage('Ingresa un número telefónico de 7 dígitos válidos.');
                return false;
            }
        }

        setErrorMessage('');
        return true;
    };

    const handleMainButtonPress = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        const normalizedEmail = email.trim().toLowerCase();

        try {
            if (activeTab === 'signup') {
                const phoneValue = phoneNumber ? `${phoneCountryCode}${phoneAreaCode}${phoneNumber}` : undefined;
                await signUp({ name: name.trim(), email: normalizedEmail, password, phone: phoneValue });

                router.push({ pathname: '/verify-otp', params: { email: normalizedEmail, password } });
                return;
            } else {
                const loginResult = await signIn({ email: normalizedEmail, password });

                if ((loginResult as any)?.requiresVerification) {
                    router.push({ pathname: '/verify-otp', params: { email: normalizedEmail, password } });
                    return;
                }
            }
        } catch (error: any) {
            logger.error(error, { context: 'authentication' });
            if (error.response?.data?.message?.includes('verify') || error.response?.status === 403) {
                setErrorMessage('Debes verificar tu cuenta primero.');
                router.push({ pathname: '/verify-otp', params: { email: normalizedEmail, password } });
                return;
            }
            if (error.response?.status === 400) {
                setErrorMessage('Datos inválidos. Verifica tu información.');
            } else if (error.response?.status === 401) {
                setErrorMessage('Credenciales incorrectas.');
            } else if (error.response?.status === 409) {
                setErrorMessage('El correo ya está registrado.');
            } else if (error.code === 'NETWORK_ERROR') {
                setErrorMessage('Error de conexión. Verifica tu internet.');
            } else {
                setErrorMessage('Error inesperado. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        phoneCountryCode,
        setPhoneCountryCode,
        phoneAreaCode,
        setPhoneAreaCode,
        phoneNumber,
        setPhoneNumber,
        loading,
        errorMessage,
        handleMainButtonPress,
        isDesktop,
        colors,
        styles,
    };
};

// Default export for this module.
export default useAuthForm;
