// Storage provider interfaces for agnostic architecture

export interface StorageProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string, bucket?: string): Promise<void>;
  deleteFiles(keys: string[], bucket?: string): Promise<void>;
  getFileUrl(key: string, bucket?: string): string;
}

export interface StorageConfig {
  provider: string;
  connectionString: string;
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  accountName?: string;
  containerName?: string;
  basePath?: string;
}

// Factory function to create storage providers
export async function createStorageProvider(config: StorageConfig): Promise<StorageProvider> {
  switch (config.provider.toLowerCase()) {
    case 'azure': {
      const { createAzureProvider } = await import('./providers/azure.provider');
      return createAzureProvider(config);
    }
    case 'local': {
      const { createLocalProvider } = await import('./providers/local.provider');
      return createLocalProvider(config);
    }
    default:
      throw new Error(`Unsupported storage provider: ${config.provider}`);
  }
}