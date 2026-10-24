// File: frontend/src/store/use-user.store.ts
// Client state management store.

import { create } from 'zustand';

import { User as AuthUser } from '@/context/AuthContext';

// Type declaration User.
export interface User extends Omit<AuthUser, 'phone' | 'phoneVerified'> {
    phone?: string | null;
    phoneVerified?: Date | null | boolean;
    isPhoneVerified?: boolean;
}

interface UserStore {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    updateUserProfile: (data: Partial<User>) => void;
}

const normalizeUser = (user: User | null): User | null => {
    if (!user) return null;
    return {
        ...user,
        isPhoneVerified: typeof user.isPhoneVerified === 'boolean'
            ? user.isPhoneVerified
            : Boolean(user.phoneVerified),
    };
};

// State store hook for useUser.
export const useUserStore = create<UserStore>((set) => ({
    user: null,
    loading: false,
    setUser: (user) => set({ user: normalizeUser(user) }),
    setLoading: (loading) => set({ loading }),
    updateUserProfile: (data) => set((state) => {
        const prevUser = state.user || {} as User;
        const nextUser: User = {
            ...prevUser,
            ...data,
        };

        if ('isPhoneVerified' in data) {
            nextUser.phoneVerified = data.isPhoneVerified;
        } else if (typeof data.phone === 'string' && data.phone !== prevUser.phone) {
            nextUser.phoneVerified = false;
            nextUser.isPhoneVerified = false;
        }

        nextUser.isPhoneVerified = typeof nextUser.isPhoneVerified === 'boolean'
            ? nextUser.isPhoneVerified
            : Boolean(nextUser.phoneVerified);

        return { user: normalizeUser(nextUser) };
    }),
}));