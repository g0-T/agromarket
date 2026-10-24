// src/utils/storage.ts
import { createStorageProvider } from './storage/index.js';
import { CONFIG } from '@/config/env.config.js';

const storagePromise = createStorageProvider({
  provider: CONFIG.STORAGE_PROVIDER as any,
  connectionString: CONFIG.STORAGE_CONNECTION_STRING,
});

export const uploadFile = async (file: any, bucket: string) => {
  const storage = await storagePromise;
  return await storage.uploadFile(file, bucket);
};

export const deleteFile = async (fileUrl: string, bucket?: string) => {
  const storage = await storagePromise;
  return await storage.deleteFile(fileUrl, bucket);
};

export const deleteFiles = async (keys: string[], bucket?: string) => {
  const storage = await storagePromise;
  return await storage.deleteFiles(keys, bucket);
};