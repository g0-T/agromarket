import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  useWindowDimensions, ScrollView,
} from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/use-auth';
import { getThemeColors } from '@/constants/theme';
import { formatBS } from '@/utils/currency';
import { useCurrency } from '@/context/CurrencyContext';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useDashboardStore } from '@/store/use-dashboard.store';

const SVG_ICONS: Record<string, string> = {
  'store': 'M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z',
  'add-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
  'add-circle-outline': 'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  'receipt-long': 'M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z',
  'dashboard': 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
};

const UniversalIcon = ({ name, color, size }: { name: string, color: string, size: number }) => {
  if (Platform.OS === 'web') {
    const path = SVG_ICONS[name] || SVG_ICONS['store']; 
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d={path} />
      </svg>
    );
  }
  return <MaterialIcons name={name as any} size={size} color={color} />;
};

// ─── Tab definition ────────────────────────────────────────────────────────────

interface TabDef {
  name: string;
  href: string;
  label: string;
  icon: string;
  iconActive: string;
  sellerOnly?: boolean;
}

const ALL_TABS: TabDef[] = [
  { name: 'index', href: '/', label: 'Mercado', icon: 'store', iconActive: 'store' },
  { name: 'PublishBatch', href: '/PublishBatch', label: 'Publicar', icon: 'add-circle-outline', iconActive: 'add-circle', sellerOnly: true },
  { name: 'Transactions', href: '/Transactions', label: 'Transacciones', icon: 'receipt-long', iconActive: 'receipt-long' },
  { name: 'dashboard', href: '/dashboard', label: 'Perfil', icon: 'dashboard', iconActive: 'dashboard' }, // Con el slash /
];

// ─── Desktop Sidebar ───────────────────────────────────────────────────────────

const DesktopSidebar = ({
  tabs, colors, pathname, router, bcvRate, loading, error, user,
}: {
  tabs: TabDef[];
  colors: any;
  pathname: string;
  router: any;
  bcvRate: number;
  loading: boolean;
  error: any;
  user: any;
}) => {
  const { isDark } = useTheme();
  const setView = useDashboardStore(state => state.setView);
  const isActive = (href: string) => {
    if (href === '/' || href === 'index') {
      return pathname === '/' || pathname === '/index';
    }

    return pathname.includes(href);
  };

  const bgSidebar = isDark ? '#111916' : '#f0f4f0';
  const borderColor = isDark ? 'rgba(44,89,38,0.2)' : 'rgba(44,89,38,0.12)';

  return (
    <View style={{ width: 240, backgroundColor: bgSidebar, borderRightWidth: 1, borderRightColor: borderColor, height: '100%' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: borderColor }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/icon.png')} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
          </View>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '900', color: colors.textColor }}>AgroMarket</Text>
            <Text style={{ fontSize: 10, color: colors.mutedText, fontWeight: '600' }}>Ganadería Digital</Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: borderColor
        }}>
          <View>
            <Text style={{ fontSize: 10, color: colors.mutedText, fontWeight: '600', marginBottom: 2 }}>
              Tasa BCV
            </Text>
            <Text style={{ fontSize: 13, color: colors.textColor, fontWeight: '700' }}>
              {loading ? 'Cargando...' : error ? 'Error' : bcvRate > 0 ? `1$ = ${bcvRate.toFixed(2)} Bs.` : '---'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}>
        <Text style={{ fontSize: 9, fontWeight: '800', color: colors.mutedText, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 }}>Principal</Text>
        {tabs.map(tab => {
          const active = isActive(tab.href);
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.href as any)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 20,
                marginHorizontal: 8, borderRadius: 12, marginBottom: 2,
                backgroundColor: active ? (isDark ? 'rgba(44,89,38,0.22)' : 'rgba(44,89,38,0.1)') : 'transparent',
              }}
            >
              <UniversalIcon name={active ? tab.iconActive : tab.icon} size={20} color={active ? colors.brand : colors.mutedText} />
              <Text style={{ fontSize: 14, fontWeight: active ? '700' : '500', color: active ? colors.brand : colors.mutedText }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}

        {user?.role === 'buyer' && (
          <TouchableOpacity
            onPress={() => { router.push('/dashboard'); setView('become_seller'); }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 20,
              marginHorizontal: 8, borderRadius: 12, marginTop: 20,
              backgroundColor: colors.brand,
            }}
          >
            <UniversalIcon name="store" size={20} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>¿Quieres vender?</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Mobile Bottom Tab Bar ─────────────────────────────────────────────────────

const MobileTabBar = ({
  tabs, colors, pathname, router,
}: {
  tabs: TabDef[];
  colors: any;
  pathname: string;
  router: any;
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/\/$/, '') || '/';
    const cleanHref = href.replace(/\/$/, '') || '/';

    if (cleanHref === '/' || cleanHref === 'index') {
      return cleanPath === '/' || cleanPath === '/index';
    }

    return cleanPath.startsWith('/' + cleanHref) || cleanPath === '/' + cleanHref;
  };

  return (
    <View style={{
      flexDirection: 'row', backgroundColor: isDark ? '#131a12' : '#ffffff',
      borderTopWidth: 1, borderTopColor: isDark ? 'rgba(44,89,38,0.2)' : 'rgba(0,0,0,0.08)',
      paddingBottom: insets.bottom || 8, paddingTop: 8,
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.href);
        return (
          <TouchableOpacity key={tab.name} onPress={() => router.push(tab.href as any)} style={{ flex: 1, alignItems: 'center' }}>
            <UniversalIcon name={active ? tab.iconActive : tab.icon} size={22} color={active ? colors.brand : colors.mutedText} />
            <Text style={{ fontSize: 10, color: active ? colors.brand : colors.mutedText }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function TabLayout() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { bcvRate, loading, error } = useCurrency();

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const pathname = usePathname();
  const router = useRouter();

  usePushNotifications();

  const visibleTabs = ALL_TABS.filter(t => !t.sellerOnly || user?.role === 'seller');

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column', backgroundColor: colors.backgroundColor }}>

      {isDesktop && (
        <DesktopSidebar
          tabs={visibleTabs}
          colors={colors}
          pathname={pathname}
          router={router}
          bcvRate={bcvRate}
          loading={loading}
          error={!!error}
          user={user}
        />
      )}

      <View style={{ flex: 1 }}>
        <Tabs
          backBehavior="none" 
          initialRouteName="dashboard/index"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, 
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="dashboard/index" options={{ href: null }} />
          <Tabs.Screen name="Transactions" options={{ href: null }} />
          <Tabs.Screen name="PublishBatch" options={{ href: null }} />
        </Tabs>
      </View>

      {!isDesktop && <MobileTabBar tabs={visibleTabs} colors={colors} pathname={pathname} router={router} />}
    </View>
  );
}