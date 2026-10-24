// File: frontend/src/components/settings/PhoneSection.tsx
// Section component for phone section.

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { InputField } from '@/components/ui/InputField';

// Type declaration PhoneSectionProps.
interface PhoneSectionProps {
    phoneCountryCode: string;
    phoneAreaCode: string;
    phoneNumber: string;
    isPhoneDropdownOpen: boolean;
    isPhoneVerified: boolean;
    phoneLoading: boolean;
    phoneAreaCodesByCountry: Record<string, string[]>;
    onSetPhoneCountryCode: (code: string) => void;
    onSetPhoneAreaCode: (code: string) => void;
    onSetPhoneNumber: (number: string) => void;
    onSetIsPhoneDropdownOpen: (open: boolean) => void;
    onSendVerificationCode: () => void;
    onVerifyPhoneCode: (code: string) => void;
    codeSent: boolean;
    isDesktop: boolean;
    colors: any;
    styles: any;
    responsiveRowStyle: object;
    responsiveLabelStyle: object;
}

// Exported constant PhoneSection.
export const PhoneSection: React.FC<PhoneSectionProps> = ({
    phoneCountryCode,
    phoneAreaCode,
    phoneNumber,
    isPhoneDropdownOpen,
    isPhoneVerified,
    phoneLoading,
    phoneAreaCodesByCountry,
    onSetPhoneCountryCode,
    onSetPhoneAreaCode,
    onSetPhoneNumber,
    onSetIsPhoneDropdownOpen,
    onSendVerificationCode,
    onVerifyPhoneCode,
    codeSent,
    isDesktop,
    colors,
    styles,
    responsiveRowStyle,
    responsiveLabelStyle,
}) => {
    const [verificationCode, setVerificationCode] = useState('');
    const canSendCode = !isPhoneVerified && phoneNumber.trim().length >= 7;
    const canVerifyCode = codeSent && !isPhoneVerified && verificationCode.trim().length === 6;

    useEffect(() => {
        if (!codeSent) {
            setVerificationCode('');
        }
    }, [codeSent]);

    return (
        <View style={styles.sectionGroup}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Teléfono</Text>
                {!isDesktop && isPhoneVerified && (
                    <View style={[styles.verifiedBadgeContainer, styles.verifiedBadgeInline]}>
                        <MaterialIcons
                            name="verified"
                            size={14}
                            color={colors.brand}
                        />
                        <Text style={styles.verifiedBadgeText}>
                            Verificado
                        </Text>
                    </View>
                )}
            </View>
            <View style={[styles.formCard, isPhoneDropdownOpen && { overflow: 'visible', zIndex: 9999, position: 'relative' }]}>
                <View style={[styles.formRow, responsiveRowStyle, { zIndex: isPhoneDropdownOpen ? 9999 : 100, position: 'relative' }]}>
                    {/* Label */}
                    <View style={[styles.formLabelWrap, responsiveLabelStyle]}>
                        <View style={styles.formIconWrap}>
                            <MaterialIcons
                                name="phone"
                                size={18}
                                color={colors.brand}
                            />
                        </View>
                        <Text style={styles.formLabel}>Teléfono</Text>
                    </View>

                    <View style={[styles.phoneInputContainer, { minWidth: 0 }]}>
                        <PhoneInput
                            countryCode={phoneCountryCode}
                            areaCode={phoneAreaCode}
                            number={phoneNumber}
                            onCountryCodeChange={onSetPhoneCountryCode}
                            onAreaCodeChange={onSetPhoneAreaCode}
                            onNumberChange={onSetPhoneNumber}
                            onOpenChange={onSetIsPhoneDropdownOpen}
                        />
                    </View>

                    {isDesktop && isPhoneVerified && (
                        <View style={styles.verifiedBadgeContainer}>
                            <MaterialIcons
                                name="verified"
                                size={14}
                                color={colors.brand}
                            />
                            <Text style={styles.verifiedBadgeText}>
                                Verificado
                            </Text>
                        </View>
                    )}
                </View>

                {canSendCode && (
                    <View
                        style={[
                            styles.formRow,
                            styles.formRowBorder,
                            responsiveRowStyle,
                            { zIndex: 50 }
                        ]}
                    >
                        {isDesktop && <View style={responsiveLabelStyle} />}
                        <View style={[styles.inputContainer, { minWidth: 0 }]}>
                            <TouchableOpacity
                                style={[
                                    styles.verifyButton,
                                    phoneLoading && styles.verifyButtonDisabled,
                                ]}
                                onPress={onSendVerificationCode}
                                disabled={!canSendCode || phoneLoading}
                                activeOpacity={0.85}
                            >
                                {phoneLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                ) : (
                                    <>
                                        <MaterialIcons
                                            name="sms"
                                            size={16}
                                            color="#fff"
                                        />
                                        <Text style={styles.verifyButtonText}>
                                            Enviar código de verificación
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {codeSent && !isPhoneVerified && (
                    <>
                        <View
                            style={[
                                styles.formRow,
                                styles.formRowBorder,
                                responsiveRowStyle,
                                { zIndex: 100 }
                            ]}
                        >
                            {isDesktop && <View style={responsiveLabelStyle} />}
                            <View style={[styles.inputContainer, { minWidth: 0 }]}>
                                <InputField
                                    value={verificationCode}
                                    onChangeText={(text: string) =>
                                        setVerificationCode(
                                            text.replace(/\D/g, '').slice(0, 6),
                                        )
                                    }
                                    placeholder="Código OTP"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    containerStyle={{ marginBottom: 0 }}
                                />
                            </View>
                        </View>
                        <View
                            style={[
                                styles.formRow,
                                styles.formRowBorder,
                                responsiveRowStyle,
                                { zIndex: 100 }
                            ]}
                        >
                            {isDesktop && <View style={responsiveLabelStyle} />}
                            <View style={[styles.inputContainer, { minWidth: 0 }]}>
                                <TouchableOpacity
                                    style={[
                                        styles.verifyButton,
                                        (!canVerifyCode || phoneLoading) && styles.verifyButtonDisabled,
                                    ]}
                                    onPress={() => onVerifyPhoneCode(verificationCode)}
                                    disabled={!canVerifyCode || phoneLoading}
                                    activeOpacity={0.85}
                                >
                                    {phoneLoading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    ) : (
                                        <Text style={styles.verifyButtonText}>
                                            Verificar código
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}

            </View>
        </View>
    );
};
