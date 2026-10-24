// File: frontend/src/components/ui/PhoneInput.tsx
// Input component for phone input.

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Platform } from 'react-native';
import { InputField } from '@/components/ui/InputField';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { Icon } from '@/components/ui/Icon';

// Component for country codes.
const countryCodes = ['+58'];
const areaCodesByCountry: Record<string, string[]> = {
    '+58': ['424', '414', '422', '412', '416', '426'],
};

// Type declaration PhoneInputProps.
interface PhoneInputProps {
    label?: string;
    icon?: string;
    countryCode: string;
    areaCode: string;
    number: string;
    onCountryCodeChange: (value: string) => void;
    onAreaCodeChange: (value: string) => void;
    onNumberChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    onOpenChange?: (open: boolean) => void;
}

// Exported constant PhoneInput.
export const PhoneInput = ({
    label,
    icon,
    countryCode,
    areaCode,
    number,
    onCountryCodeChange,
    onAreaCodeChange,
    onNumberChange,
    disabled = false,
    placeholder,
    onOpenChange,
}: PhoneInputProps) => {
    const { theme, colors } = useTheme(() => ({}));
    const styles = getStyles(colors);

    // State to track which field has focus (green border)
    const [focusedField, setFocusedField] = useState<'country' | 'area' | 'number' | null>(null);
    // State for the dropdowns
    const [openDropdown, setOpenDropdown] = useState<'country' | 'area' | null>(null);

    const handleOpenDropdown = (type: 'country' | 'area' | null) => {
        if (disabled) return;
        setOpenDropdown(type);
        setFocusedField(type);
        if (onOpenChange) onOpenChange(type !== null);
    };

    const areaOptions = areaCodesByCountry[countryCode] || [];

    useEffect(() => {
        if (!areaOptions.includes(areaCode) && areaOptions.length > 0) {
            onAreaCodeChange(areaOptions[0]);
        }
    }, [countryCode]);

    const handleCountrySelect = (value: string) => {
        onCountryCodeChange(value);
        handleOpenDropdown(null);
        setFocusedField(null);
    };

    const handleAreaSelect = (value: string) => {
        onAreaCodeChange(value);
        handleOpenDropdown(null);
        setFocusedField(null);
    };

    const handleNumberChange = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, '').slice(0, 7);
        onNumberChange(cleaned);
    };

    // Style applied when a field is focused (same as in InputField)
    const focusedStyle = {
        borderColor: colors.brand,
        borderWidth: 1.5,
        backgroundColor: theme === 'dark' ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.04)',
    };

    return (
        <View style={[styles.container, openDropdown !== null && { zIndex: 99999, position: 'relative', overflow: 'visible' }]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.row, openDropdown !== null && { zIndex: 99999, position: 'relative', overflow: 'visible' }]}>
                {/* COUNTRY SELECTOR */}
                <View style={[
                    styles.field,
                    focusedField === 'country' && focusedStyle,
                    openDropdown === 'country' && { zIndex: 99999, elevation: 20 },
                    disabled && styles.disabledField
                ]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (!disabled) {
                                const isOpening = openDropdown !== 'country';
                                handleOpenDropdown(isOpening ? 'country' : null);
                            }
                        }}
                        style={styles.selectorButton}
                    >
                        <Text style={[styles.fieldText, disabled && styles.disabledText]}>{countryCode || '+58'}</Text>
                        <Icon name="keyboard-arrow-down" size={18} color={disabled ? colors.mutedText : colors.textColor} />
                    </TouchableOpacity>

                    {openDropdown === 'country' && !disabled && (
                        <ScrollView
                            style={styles.dropdownListContainer}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {countryCodes.map((code) => (
                                <TouchableOpacity
                                    key={code}
                                    onPress={() => handleCountrySelect(code)}
                                    style={styles.dropdownItem}
                                >
                                    <Text style={styles.dropdownText}>{code}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={[
                    styles.field,
                    focusedField === 'area' && focusedStyle,
                    disabled && styles.disabledField,
                    openDropdown === 'area' && { zIndex: 99999, elevation: 20 }
                ]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (!disabled) {
                                const isOpening = openDropdown !== 'area';
                                handleOpenDropdown(isOpening ? 'area' : null);
                            }
                        }}
                        disabled={disabled || areaOptions.length === 0}
                        style={styles.selectorButton}
                    >
                        <Text style={[styles.fieldText, disabled && styles.disabledText]}>
                            {areaCode || '424'}
                        </Text>
                        <Icon name="keyboard-arrow-down" size={18} color={disabled ? colors.mutedText : colors.textColor} />
                    </TouchableOpacity>

                    {openDropdown === 'area' && !disabled && (
                        <ScrollView
                            style={styles.dropdownListContainer}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {areaOptions.map((code) => (
                                <TouchableOpacity
                                    key={code}
                                    onPress={() => handleAreaSelect(code)}
                                    style={styles.dropdownItem}
                                >
                                    <Text style={styles.dropdownText}>{code}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        value={number}
                        onChangeText={(val) => onNumberChange(val.replace(/[^0-9]/g, ''))}
                        placeholder={placeholder || "0000000"}
                        keyboardType="number-pad"
                        maxLength={7}
                        editable={!disabled}
                        containerStyle={{ marginBottom: 0 }}
                        wrapperStyle={{ height: 55 }}
                        onFocus={() => {
                            setOpenDropdown(null);
                            setFocusedField('number');
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const getStyles = (colors: any) => {
    return StyleSheet.create({
        container: {
            marginBottom: 0,
            width: '100%',
        },
        label: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.mutedText,
            marginBottom: 8,
            marginLeft: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: 8,
            width: '100%',
        },
        field: {
            width: 75,
            height: 55,
            borderWidth: 1.5,
            borderColor: colors.borderColor,
            borderRadius: 14,
            backgroundColor: colors.cardColor,
            position: 'relative',
            zIndex: 1,
            overflow: 'visible',
            justifyContent: 'center',
        },
        dropdownListContainer: {
            position: 'absolute',
            top: '105%',
            left: 0,
            width: 75,
            backgroundColor: colors.cardColor,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: colors.brand,
            maxHeight: 120,
            zIndex: 99999,
            elevation: 20,
            overflow: 'hidden',
        },
        numberField: {
            flex: 2,
        },
        selectorButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            height: '100%',
        },
        fieldText: {
            color: colors.textColor,
            fontSize: 14,
            fontWeight: '600',
        },
        numberInput: {
            height: '100%',
            paddingHorizontal: 12,
            color: colors.textColor,
            fontSize: 14,
        },
        numberFieldContainer: {
            flex: 1,
            height: '100%',
        },
        dropdownItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: colors.cardColor,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.borderColor,
        },
        dropdownText: {
            color: colors.textColor,
            fontSize: 14,
        },
        disabledField: {
            backgroundColor: colors.backgroundColor,
            borderColor: colors.borderColor,
        },
        disabledText: {
            color: colors.mutedText,
        },
    });
};
