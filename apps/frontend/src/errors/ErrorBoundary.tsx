// File: frontend/src/errors/ErrorBoundary.tsx
// Error handling or boundary component definitions.

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { captureException } from '@/utils/sentry';
import logger from '@/utils/logger';

type State = { hasError: boolean; error?: Error };

// Exported class ErrorBoundary.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: any) {
        logger.error(error, { context: 'ErrorBoundary', info });
        captureException(error, { info });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Algo salió mal.</Text>
                    <Text style={styles.message}>Intenta recargar la aplicación o contacta al soporte.</Text>
                    <View style={styles.actions}>
                        <Button title="Reintentar" onPress={this.handleReset} />
                    </View>
                </View>
            );
        }

        return this.props.children as JSX.Element;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 12 },
    actions: { width: '60%' },
});

// Default export for this module.
export default ErrorBoundary;
