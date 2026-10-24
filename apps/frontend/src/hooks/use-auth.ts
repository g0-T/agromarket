// File: frontend/src/hooks/use-auth.ts
// Custom hook logic for React state and side effects.

import { useContext } from 'react';
import AuthContext, { AuthContextType, User } from '@/context/AuthContext';

interface SignInCredentials {
    email: string;
    password: string;
}

interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

interface UseAuthResult {
    user: User | null;
    isReady: boolean;
    signIn: (creds: SignInCredentials) => Promise<void>;
    signUp: (creds: SignUpCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
    updateUser: (user: User) => void;
}

// Exported constant useAuth.
export const useAuth = (): UseAuthResult => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const signIn = async (creds: SignInCredentials) => {
        return context.signIn(creds);
    };

    const signUp = async (creds: SignUpCredentials) => {
        return context.signUp(creds);
    };

    const signOut = async () => {
        return context.signOut();
    };

    return {
        user: context.user,
        isReady: context.isReady,
        signIn,
        signUp,
        signOut,
        refreshUser: context.refreshUser,
        updateUser: context.updateUser,
    };
};
