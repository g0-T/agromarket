
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardHeaderProps {
    isDesktop: boolean;
    userName: string;
    notifCount: number;
    colors: any;
    styles: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isDesktop, userName, notifCount, colors, styles }) => {
    if (isDesktop) {
        return (
            <View style={styles.greetingBanner}>
                <View style={styles.greetingBannerContent}>
                    <Text style={styles.greetingBannerTitle}>Bienvenido, {userName.split(' ')[0]} 👋</Text>
                    <Text style={styles.greetingBannerSubtitle}>Gestiona tus ventas y lotes activos.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mobileTopBar}>
            <View>
                <Text style={styles.mobileTopBarTitle}>Mi Cuenta</Text>
                <Text style={styles.mobileTopBarSub}>Gestiona tu perfil y rol</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
                <MaterialIcons name="notifications" size={22} color={colors.brand} />
                {notifCount > 0 && (
                    <View style={styles.notifDot}>
                        <Text style={styles.notifDotText}>{notifCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default DashboardHeader;
