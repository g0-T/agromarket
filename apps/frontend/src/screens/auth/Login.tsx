// File: frontend/src/screens/auth/Login.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthForm } from '@/hooks/auth/use-auth-form';
import AuthForm from '@/components/auth/AuthForm';
import { Icon } from '@/components/ui/Icon';

const FEATURES = [
    { icon: 'verified' as const, text: 'Vendedores y compradores verificados' },
    { icon: 'local-shipping' as const, text: 'Rastreo de lotes en tiempo real' },
    { icon: 'trending-up' as const, text: 'Precios actualizados con tasa BCV' },
    { icon: 'chat-bubble' as const, text: 'Chat directo entre partes' },
];

const AuthScreen = () => {
    const { width, height } = useWindowDimensions();
    const {
        isDesktop,
        colors,
        styles,
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
    } = useAuthForm();

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={isDesktop ? [styles.scrollDesktopContent, { minHeight: height }] : styles.scrollContent}
                    keyboardShouldPersistTaps="always"
                >
                    {isDesktop ? (
                        <View style={[styles.containerDesktop, { minHeight: height, width: '100%' }]}>
                            <View style={styles.desktopSidePanel}>
                                <View style={styles.sidePanelContent}>
                                    <View style={[styles.desktopLogoWrap, { alignSelf: 'flex-start' }]}>
                                        <Image source={require('../../../assets/icon.png')} style={{ width: 52, height: 52, resizeMode: 'contain' }} />
                                    </View>
                                    <Text style={styles.desktopBrandText}>AgroMarket</Text>

                                    <View style={styles.desktopFeatureList}>
                                        {FEATURES.map((feature, index) => (
                                            <View key={index} style={styles.desktopFeatureItem}>
                                                <Icon name={feature.icon} size={20} color="#fff" />
                                                <Text style={styles.desktopFeatureText}>{feature.text}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundColor }}>
                                <AuthForm
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    name={name}
                                    setName={setName}
                                    phoneCountryCode={phoneCountryCode}
                                    setPhoneCountryCode={setPhoneCountryCode}
                                    phoneAreaCode={phoneAreaCode}
                                    setPhoneAreaCode={setPhoneAreaCode}
                                    phoneNumber={phoneNumber}
                                    setPhoneNumber={setPhoneNumber}
                                    loading={loading}
                                    errorMessage={errorMessage}
                                    handleMainButtonPress={handleMainButtonPress}
                                    isDesktop={isDesktop}
                                    colors={colors}
                                    styles={styles}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={{ padding: 20 }}>
                            <AuthForm
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                email={email}
                                setEmail={setEmail}
                                password={password}
                                setPassword={setPassword}
                                name={name}
                                setName={setName}
                                phoneCountryCode={phoneCountryCode}
                                setPhoneCountryCode={setPhoneCountryCode}
                                phoneAreaCode={phoneAreaCode}
                                setPhoneAreaCode={setPhoneAreaCode}
                                phoneNumber={phoneNumber}
                                setPhoneNumber={setPhoneNumber}
                                loading={loading}
                                errorMessage={errorMessage}
                                handleMainButtonPress={handleMainButtonPress}
                                isDesktop={isDesktop}
                                colors={colors}
                                styles={styles}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
};

// Default export for this module.
export default AuthScreen;
