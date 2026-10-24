// File: frontend/src/utils/auth-events.ts
// Utility helper functions used across frontend code.

// Simple pub/sub for authentication events.
// Allows cross-module notification (e.g. API layer triggers logout, UI layer reacts).

type Listener = () => void;

const logoutListeners: Listener[] = [];

// Register a listener for logout events.
export function onLogout(listener: Listener) {
    logoutListeners.push(listener);
    return () => {
        const idx = logoutListeners.indexOf(listener);
        if (idx !== -1) logoutListeners.splice(idx, 1);
    };
}

// Notify all registered logout listeners.
export function emitLogout() {
    logoutListeners.slice().forEach((fn) => fn());
}
