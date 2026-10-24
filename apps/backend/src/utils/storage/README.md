# Storage-Agnostic Architecture

This module provides a storage-agnostic layer that allows switching between storage providers (Azure Blob Storage or local filesystem) without changing application code.

## Configuration

### Environment variables

```bash
# Storage provider: 'azure' or 'local' (default: 'local' in development)
STORAGE_PROVIDER="azure"

# Provider-specific connection string or local path (default: ./uploads in development)
STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net"
```

### Examples

#### Azure Blob Storage
```bash
STORAGE_PROVIDER="azure"
STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net"
```

#### Local Filesystem
```bash
STORAGE_PROVIDER="local"
STORAGE_CONNECTION_STRING="./uploads"
```

## Usage in code

### Import
```typescript
import { getStorageProvider, uploadFile, deleteFile } from '@/utils/storage/storage.config';
```

### Basic usage
```typescript
// Get configured storage provider instance
const storage = getStorageProvider();

// Upload file
const result = await storage.uploadFile(file, 'seller-applications');
console.log('URL:', result.url);
console.log('Key:', result.key);

// Delete file
await storage.deleteFile(result.key);

// Get public URL
const url = storage.getFileUrl(result.key);
```

### Legacy helper functions
```typescript
import { uploadFile, deleteFile } from '@/utils/storage';

// These helper functions keep backward compatibility
const url = await uploadFile(file, 'bucket-name');
await deleteFile(url, 'bucket-name');
```

## Architecture

The storage implementation exposes the `StorageProvider` interface and a `StorageConfig` type. Implementations include Azure and local filesystem providers.

```typescript
interface StorageProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<void>;
  deleteFiles(keys: string[]): Promise<void>;
  getFileUrl(key: string): string;
}

interface StorageConfig {
  provider: string;
  connectionString: string;
  bucket?: string;
  containerName?: string;
  basePath?: string;
}
```

### Factory pattern

A factory creates the correct provider instance based on configuration. The factory and helpers live in `src/utils/storage` (for example `storage.config`).

```typescript
export function createStorageProvider(config: StorageConfig): StorageProvider {
  switch (config.provider.toLowerCase()) {
    case 'azure': return createAzureProvider(config);
    case 'local': return createLocalProvider(config);
    default: throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
```

## Providers implemented

### Azure Blob Storage
- ✅ Upload/delete files
- ✅ Public URLs
- ✅ Configurable containers

### Local filesystem
- ✅ Upload/delete files
- ✅ Relative URLs for serving static assets
- ✅ Configurable base path

## Migration

To migrate to a different provider:

1. Change environment variables:
```bash
STORAGE_PROVIDER="azure"
STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=..."
```

2. Restart the application — the factory will instantiate the configured provider automatically.

3. Existing files remain intact; only new uploads will use the new provider.

## Benefits

- 🔄 Easy provider switching without code changes
- 🔒 Centralized configuration via environment variables
- 🧪 Easy testing with different providers
- 📈 Scales across environments
- 🔧 Maintainable with clear interfaces
- 🔄 Backward compatible with existing helpers
