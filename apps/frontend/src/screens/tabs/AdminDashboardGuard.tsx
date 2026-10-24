// File: frontend/src/screens/tabs/AdminDashboardGuard.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { useRoleGuard } from '@/hooks/auth/use-role-guard';
import AdminDashboardScreen from '@/screens/tabs/AdminDashboardScreen';

// Default React component export.
export default function AdminDashboardGuard() {
    useRoleGuard(['admin'], '/');
    return <AdminDashboardScreen />;
}
