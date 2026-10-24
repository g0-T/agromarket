import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export const metadata = {
    title: 'AgroMarket | Política de privacidad',
};

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Política de privacidad</Text>
                <Text style={styles.subtitle}>Cómo recogemos, usamos y protegemos tus datos.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>1. Datos que recopilamos</Text>
                <Text style={styles.paragraph}>
                    Recopilamos datos personales como nombre, correo, teléfono e información de transacciones. También almacenamos datos de mensajes de chat para mejorar la experiencia y soporte.
                </Text>

                <Text style={styles.sectionTitle}>2. Uso de los datos</Text>
                <Text style={styles.paragraph}>
                    Utilizamos la información para gestionar cuentas, procesar transacciones, enviar notificaciones relevantes y mejorar la plataforma.
                </Text>

                <Text style={styles.sectionTitle}>3. Compartir datos</Text>
                <Text style={styles.paragraph}>
                    No vendemos tus datos. Podemos compartir información con proveedores de servicios como almacenamiento y notificaciones, siempre bajo acuerdos de confidencialidad.
                </Text>

                <Text style={styles.sectionTitle}>4. Seguridad</Text>
                <Text style={styles.paragraph}>
                    Utilizamos cifrado en tránsito y medidas de seguridad para proteger los datos. Los mensajes de chat están cifrados en la base de datos antes de guardarse.
                </Text>

                <Text style={styles.sectionTitle}>5. Derechos del usuario</Text>
                <Text style={styles.paragraph}>
                    Puedes solicitar acceso, rectificación o eliminación de tus datos mediante la sección de soporte o los canales de contacto de AgroMarket.
                </Text>

                <Text style={styles.sectionTitle}>6. Cambios</Text>
                <Text style={styles.paragraph}>
                    Actualizaremos esta política cuando sea necesario. El uso continuado después de cambios implica aceptación de la versión actualizada.
                </Text>
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
        color: '#111827',
    },
    paragraph: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
        marginBottom: 18,
    },
    backButton: {
        margin: 20,
        borderRadius: 14,
        backgroundColor: '#1F7A4D',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
});
