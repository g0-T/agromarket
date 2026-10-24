import { Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { useRoleGuard } from '@/hooks/auth/use-role-guard';
import { getStyles } from '@/styles/screens/auth/auth.styles';

export default function AdminLayout() {
    const { isReady } = useAuth();
    const { colors } = useTheme(getStyles);

    useRoleGuard(['admin'], '/');

    if (!isReady) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
            <Slot />
        </View>
    );
}
