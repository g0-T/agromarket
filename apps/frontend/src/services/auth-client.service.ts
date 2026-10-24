// File: frontend/src/services/auth-client.service.ts
// Frontend service module for API or client operations.

import logger from '@/utils/logger';

let authClient: any = null;

const initializeAuthClient = async () => {
    if (authClient) return authClient;

    try {
        const { createAuthClient } = await import("@better-auth/client");

        authClient = createAuthClient();
        return authClient;
    } catch (error) {
        logger.warn("Failed to load @better-auth/client", { error });
        throw new Error(
            "Auth client unavailable. Ensure @better-auth/client is installed and the authentication provider is configured correctly."
        );
    }
};

// Exported constant getAuthClient.
export const getAuthClient = () => {
    if (!authClient) {
        throw new Error("Auth client not initialized. Call initializeAuthClient() first.");
    }
    return authClient;
};

// Exported constant initializeAuthClientAsync.
export const initializeAuthClientAsync = initializeAuthClient;