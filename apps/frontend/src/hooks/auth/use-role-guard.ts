// File: frontend/src/hooks/auth/use-role-guard.ts
// Custom hook logic for React state and side effects.

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

// Exported constant useRoleGuard.
export const useRoleGuard = (allowedRoles: string[], redirectTo = '/') => {
    const { user, isReady } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isReady) return;
        if (!user || !allowedRoles.includes(user.role)) {
            router.replace(redirectTo);
        }
    }, [allowedRoles, isReady, redirectTo, router, user]);
};
