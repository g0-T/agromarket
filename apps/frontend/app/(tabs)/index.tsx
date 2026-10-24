import MarketScreen from '@/screens/market/MarketScreen';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'expo-router';

export const metadata = {
  title: 'AgroMarket | Mercado',
};

export default function MarketRoute() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  return <MarketScreen />;
}