// File: frontend/src/components/publish/sections/Section5Price.tsx
// Section component for section 5 price.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SectionCard from '@/components/publish/SectionCard';
import { InputField } from '@/components/ui/InputField';

// Type declaration Section5PriceProps.
interface Section5PriceProps {
    styles: any;
    colors: any;
    isDesktop: boolean;
    formData: any;
    updateNumber: (key: string, value: string, allowDecimals?: boolean) => void;
    priceNum: number;
    companyFee: number;
    netIncome: number;
}

// Exported constant Section5Price.
export const Section5Price: React.FC<Section5PriceProps> = ({
    styles,
    colors,
    isDesktop,
    formData,
    updateNumber,
    priceNum,
    companyFee,
    netIncome,
}) => (
    <SectionCard styles={styles} style={isDesktop ? styles.fullWidthCard : styles.multimediaCard}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cash" size={20} color={colors.brand} />
            <Text style={styles.sectionTitle}>5. Definir Precio</Text>
        </View>

        <Text style={styles.label}>Precio total del lote</Text>
        <View style={styles.priceInputWrap}>
            <Text style={styles.currencyLabel}>{formData.currency}</Text>
            <InputField
                style={[styles.input, styles.priceInput, { marginLeft: 0, width: '100%', flex: 1 }]}
                keyboardType="numeric"
                placeholder="0.00"
                value={formData.price}
                onChangeText={(v: string) => updateNumber('price', v, true)}
                wrapperStyle={{ flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, minWidth: 0 }}
                containerStyle={{ marginBottom: 0, flex: 1, minWidth: 0 }}
            />
        </View>

        {!!formData.heads && parseInt(formData.heads) > 0 && priceNum > 0 && (
            <View style={styles.priceBreakdown}>
                <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>Precio por cabeza</Text>
                    <Text style={styles.breakdownValue}>{formData.currency} {(priceNum / parseInt(formData.heads)).toFixed(2)}</Text>
                </View>
                {!!formData.weight && (
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Precio por kg</Text>
                        <Text style={styles.breakdownValue}>{formData.currency} {(priceNum / (parseInt(formData.heads) * parseFloat(formData.weight))).toFixed(2)}</Text>
                    </View>
                )}
            </View>
        )}

        <View style={styles.feeContainer}>
            <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Precio del lote</Text>
                <Text style={styles.feeValue}>{formData.currency} {priceNum.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Comisión (5%)</Text>
                <Text style={styles.feeValue}>-{formData.currency} {companyFee.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.feeRow}>
                <Text style={styles.feeLabelBold}>Recibirás</Text>
                <Text style={styles.feeValueBold}>{formData.currency} {netIncome.toFixed(2)}</Text>
            </View>
        </View>
    </SectionCard>
);
