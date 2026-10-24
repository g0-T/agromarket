
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

interface DashboardShellProps {
    isDesktop: boolean;
    styles: any;
    children: React.ReactNode;
}

// Exported constant DashboardShell.
export const DashboardShell: React.FC<DashboardShellProps> = ({
    isDesktop,
    styles,
    children,
}) => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={isDesktop ? styles.desktopContainer : { flex: 1 }}>
                {children}
            </View>
        </SafeAreaView>
    );
};
