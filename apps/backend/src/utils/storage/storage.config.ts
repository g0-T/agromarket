import { createStorageProvider, StorageConfig } from './index';
import { CONFIG } from '@/config/env.config';

// Parse connection string based on provider
function parseConnectionString(provider: string, connectionString: string): Partial<StorageConfig> {
  switch (provider.toLowerCase()) {
    case 'azure': {
      // Azure connection string format: DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=...
      const azureParams: Record<string, string> = {};
      connectionString.split(';').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) azureParams[key] = value;
      });

      return {
        accountName: azureParams.AccountName,
        containerName: 'seller-applications', // Default container
      };
    }

    case 'local':
      // For local, connection string is the base path
      return {
        basePath: connectionString || './uploads',
      };

    default:
      return {};
  }
}

// Create storage configuration from environment
export function createStorageConfig(): StorageConfig {
  const provider = CONFIG.STORAGE_PROVIDER;
  const connectionString = CONFIG.STORAGE_CONNECTION_STRING;

  if (provider === 'azure' && !connectionString) {
    throw new Error(`Connection string required for storage provider: ${provider}`);
  }

  const parsedConfig = parseConnectionString(provider, connectionString);

  return {
    provider,
    connectionString,
    ...parsedConfig,
  } as StorageConfig;
}

// Global storage provider instance
let storageProvider: Awaited<ReturnType<typeof createStorageProvider>> | null = null;

export async function getStorageProvider(): Promise<Awaited<ReturnType<typeof createStorageProvider>>> {
  if (!storageProvider) {
    const config = createStorageConfig();
    storageProvider = await createStorageProvider(config);
  }
  return storageProvider!;
}

// Convenience functions for backward compatibility
export const uploadFile = async (file: Express.Multer.File, path: string) => {
  const storage = await getStorageProvider();
  return storage.uploadFile(file, path);
};

export const deleteFile = async (key: string) => {
  const storage = await getStorageProvider();
  return storage.deleteFile(key);
};

export const deleteFiles = async (keys: string[]) => {
  const storage = await getStorageProvider();
  return storage.deleteFiles(keys);
};

export const getFileUrl = async (key: string) => {
  const storage = await getStorageProvider();
  return storage.getFileUrl(key);
};