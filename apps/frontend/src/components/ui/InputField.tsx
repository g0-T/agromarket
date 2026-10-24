// File: frontend/src/components/ui/InputField.tsx
// Input component for input field.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ReturnKeyTypeOptions } from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getThemeColors } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';

// Type declaration Props.
interface Props {
  label?: string;
  icon?: string;
  placeholder?: string;
  secure?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad' | 'numeric';
  value: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  wrapperStyle?: any;
  containerStyle?: any;
  placeholderTextColor?: string;
  onFocus?: () => void;
  editable?: boolean;
  maxLength?: number;
}

// Component for get input styles.
const getInputStyles = (theme: any) => {
  const isDark = theme === 'dark';
  const colors = getThemeColors(isDark);

  return StyleSheet.create({
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.mutedText,
      marginBottom: 7,
      marginLeft: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardColor,
      borderWidth: 1.5,
      borderColor: colors.borderColor,
      borderRadius: 14,
      paddingHorizontal: 14,
    },
    inputWrapperFocused: {
      borderColor: colors.brand,
      backgroundColor: isDark ? 'rgba(44,89,38,0.12)' : 'rgba(44,89,38,0.04)',
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 15,
      color: colors.textColor,
      fontSize: 15,
      ...Platform.select({
        web: {
          outlineStyle: 'none',
          outlineWidth: 0,
        }
      })
    },
  });
};

// Exported constant InputField.
export const InputField = ({
  label,
  icon,
  placeholder,
  secure = false,
  keyboardType = 'default',
  value,
  onChangeText,
  multiline = false,
  numberOfLines,
  returnKeyType,
  secureTextEntry = false,
  autoCapitalize = 'none',
  style,
  wrapperStyle,
  containerStyle,
  placeholderTextColor,
  onFocus,
  editable = true,
  maxLength,
}: Props) => {
  const { theme, colors } = useTheme(() => ({}));
  const styles = getInputStyles(theme);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused, wrapperStyle]}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={focused ? colors.brand : colors.mutedText}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || colors.placeholderColor}
          secureTextEntry={(secure || secureTextEntry) && !visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyType={returnKeyType}
          editable={editable}
          maxLength={maxLength}
        />
        {secure && (
          <TouchableOpacity onPress={() => setVisible((v) => !v)} style={{ padding: 4 }}>
            <Icon name={visible ? 'visibility' : 'visibility-off'} size={18} color={colors.mutedText} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
