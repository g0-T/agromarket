import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export const metadata = {
    title: 'AgroMarket | Términos y condiciones',
};

export default function TermsPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Términos y condiciones</Text>
                <Text style={styles.subtitle}>Reglas y responsabilidades para el uso de AgroMarket.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>1. Aceptación</Text>
                <Text style={styles.paragraph}>
                    Al utilizar AgroMarket aceptas estas condiciones. Debes comportarte con respeto, proporcionar datos válidos y no usar la plataforma para actividades ilícitas.
                </Text>

                <Text style={styles.sectionTitle}>2. Registro y acceso</Text>
                <Text style={styles.paragraph}>
                    El registro debe realizarse con información verdadera. Cada usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.
                </Text>

                <Text style={styles.sectionTitle}>3. Publicaciones y transacciones</Text>
                <Text style={styles.paragraph}>
                    Las publicaciones deben ser veraces y completas. AgroMarket no es el vendedor ni comprador: actúa como plataforma de intermediación y no asume responsabilidad por acuerdos comerciales entre usuarios.
                </Text>

                <Text style={styles.sectionTitle}>4. Mensajería</Text>
                <Text style={styles.paragraph}>
                    El chat entre usuarios se ofrece para coordinar ventas y resolver dudas. Queda prohibido enviar contenido ofensivo, fraudulento o spam.
                </Text>

                <Text style={styles.sectionTitle}>5. Uso aceptable</Text>
                <Text style={styles.paragraph}>
                    No publiques material protegido por derechos de autor sin autorización. No debes intentar acceder a datos ajenos ni interferir con el servicio.
                </Text>

                <Text style={styles.sectionTitle}>6. Modificaciones</Text>
                <Text style={styles.paragraph}>
                    AgroMarket puede actualizar estos términos en cualquier momento. El uso continuado implica aceptación de los cambios.
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
