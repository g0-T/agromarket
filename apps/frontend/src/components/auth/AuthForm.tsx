// File: frontend/src/components/auth/AuthForm.tsx
// Form component for auth form.

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { InputField } from '@/components/ui/InputField';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { getStyles } from '@/styles/screens/auth/auth.styles';
import { AuthFormTab, UseAuthFormResult } from '@/hooks/auth/use-auth-form';

// Component for features.
const FEATURES = [
    { icon: 'verified' as const, text: 'Vendedores y compradores verificados' },
    { icon: 'local-shipping' as const, text: 'Rastreo de lotes en tiempo real' },
    { icon: 'trending-up' as const, text: 'Precios actualizados con tasa BCV' },
    { icon: 'chat-bubble' as const, text: 'Chat directo entre partes' },
];

// Type declaration AuthFormProps.
export type AuthFormProps = Pick<UseAuthFormResult,
    | 'activeTab'
    | 'setActiveTab'
    | 'email'
    | 'setEmail'
    | 'password'
    | 'setPassword'
    | 'name'
    | 'setName'
    | 'phoneCountryCode'
    | 'setPhoneCountryCode'
    | 'phoneAreaCode'
    | 'setPhoneAreaCode'
    | 'phoneNumber'
    | 'setPhoneNumber'
    | 'loading'
    | 'errorMessage'
    | 'handleMainButtonPress'
    | 'isDesktop'
    | 'colors'
    | 'styles'
>;

// Form component for auth input collection.
export const AuthForm = ({
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
}: AuthFormProps) => {
    return (
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
            {!isDesktop && (
                <View style={styles.header}>
                    <View style={styles.logoSquare}>
                        <Image source={require('../../../assets/icon.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                    </View>
                    <Text style={styles.mainTitle}>AgroMarket</Text>
                    <Text style={styles.subtitle}>MERCADO GANADERO</Text>
                </View>
            )}

            <View style={styles.toggleContainer}>
                {(['login', 'signup'] as AuthFormTab[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.toggleBtn, activeTab === tab && styles.toggleBtnActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={activeTab === tab ? styles.toggleTextActive : styles.toggleTextInactive}>
                            {tab === 'login' ? 'Entrar' : 'Registrarse'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.form}>
                {activeTab === 'signup' ? (
                    <>
                        <InputField
                            label="Nombre completo"
                            icon="badge"
                            placeholder="Juan Pérez"
                            value={name}
                            onChangeText={setName}
                            containerStyle={[styles.inputContainer, { zIndex: 4 }]}
                            wrapperStyle={styles.inputWrapper}
                        />
                        <View style={[styles.inputContainer, { zIndex: 3 }]}>
                            <View style={styles.phoneRow}>
                                <PhoneInput
                                    label="Teléfono"
                                    icon="phone"
                                    countryCode={phoneCountryCode}
                                    areaCode={phoneAreaCode}
                                    number={phoneNumber}
                                    onCountryCodeChange={setPhoneCountryCode}
                                    onAreaCodeChange={setPhoneAreaCode}
                                    onNumberChange={setPhoneNumber}
                                    placeholder="0000000"
                                />
                            </View>
                        </View>
                        <InputField
                            label="Correo electrónico"
                            icon="email"
                            placeholder="ejemplo@agro.ve"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={[styles.inputContainer, { zIndex: 2 }]}
                            wrapperStyle={styles.inputWrapper}
                        />
                        <InputField
                            label="Contraseña"
                            icon="lock-outline"
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            containerStyle={[styles.inputContainer, { zIndex: 1 }]}
                            wrapperStyle={styles.inputWrapper}
                        />
                    </>
                ) : (
                    <>
                        <InputField
                            label="Correo electrónico"
                            icon="mail"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={[styles.inputContainer, { zIndex: 2 }]}
                            wrapperStyle={styles.inputWrapper}
                        />
                        <InputField
                            label="Contraseña"
                            icon="lock"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            containerStyle={[styles.inputContainer, { zIndex: 1 }]}
                            wrapperStyle={styles.inputWrapper}
                        />
                    </>
                )}
            </View>

            {errorMessage ? (
                <Text style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.6 }]}
                onPress={handleMainButtonPress}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitBtnText}>
                        {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                )}
            </TouchableOpacity>

            {!isDesktop && (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Al continuar, aceptas nuestros términos y condiciones.
                    </Text>
                </View>
            )}
        </View>
    );
};

// Default export for this module.
export default AuthForm;
