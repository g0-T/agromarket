
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardProfileProps {
    user: {
        name: string;
        email: string;
        joined: string;
        isSeller: boolean;
        role: string;
    };
    isCompact?: boolean;
    showSellerCta: boolean;
    onSellerPress: () => void;
    colors: any;
    styles: any;
}

const DashboardProfile: React.FC<DashboardProfileProps> = ({ user, isCompact = false, showSellerCta, onSellerPress, colors, styles }) => {
    return (
        <>
            <View style={isCompact ? styles.desktopProfileCard : styles.profileCard}>
                <View style={isCompact ? styles.desktopAvatarRow : styles.avatarRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
                        <View style={styles.avatarOnline} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                        <Text style={[styles.userEmail, { marginBottom: 6, color: colors.mutedText }]} numberOfLines={1} ellipsizeMode="tail">
                            {user.email}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <MaterialIcons name="calendar-today" size={12} color={colors.mutedText} />
                            <Text style={styles.locationText}>Miembro desde {user.joined}</Text>
                        </View>
                    </View>
                    {!isCompact && (
                        <TouchableOpacity style={styles.editBtn}>
                            <MaterialIcons name="edit" size={16} color={colors.brand} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.profileMeta}>
                    <View style={styles.roleBadge}>
                        <MaterialIcons name={user.isSeller ? 'store' : 'person'} size={12} color={colors.brand} />
                        <Text style={styles.roleBadgeText}>{user.role}</Text>
                    </View>
                </View>
            </View>
            {showSellerCta && (
                <TouchableOpacity style={styles.sellerCta} onPress={onSellerPress} activeOpacity={0.85}>
                    <View style={styles.sellerCtaIconWrap}>
                        <MaterialIcons name="store" size={24} color={colors.brand} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sellerCtaTitle}>¿Quieres vender?</Text>
                        <Text style={styles.sellerCtaSubtitle}>Solicita convertirte en vendedor y sube tus documentos.</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color="#fff" style={{ opacity: 0.7 }} />
                </TouchableOpacity>
            )}
        </>
    );
};

export default DashboardProfile;
