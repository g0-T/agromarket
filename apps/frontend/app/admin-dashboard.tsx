import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export const metadata = {
    title: 'AgroMarket | Admin',
};

export default function AdminDashboardRedirect() {
    const { user, isReady } = useAuth();

    if (!isReady) {
        return null;
    }

    if (user?.role === 'admin') {
        return <Redirect href="/admin" />;
    }

    return <Redirect href="/" />;
}
