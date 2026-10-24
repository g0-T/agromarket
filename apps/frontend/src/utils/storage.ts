// File: frontend/src/utils/storage.ts
// Lightweight storage wrapper for web and native platforms.

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import logger from './logger';

const isWeb = Platform.OS === 'web';

// Tiny wrapper around SecureStore/localStorage so implementation can change later.
export async function save(key: string, value: string): Promise<void> {
    try {
        if (isWeb) {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    } catch (e) {
        logger.warn('storage save failed', { error: e });
    }
}

// Load a stored value by key.
export async function load(key: string): Promise<string | null> {
    try {
        if (isWeb) {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    } catch (e) {
        logger.warn('storage load failed', { error: e });
        return null;
    }
}

// Remove an item from storage.
export async function remove(key: string): Promise<void> {
    try {
        if (isWeb) {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (e) {
        logger.warn('storage remove failed', { error: e });
    }
}