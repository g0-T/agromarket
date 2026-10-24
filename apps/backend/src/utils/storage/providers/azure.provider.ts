import { StorageProvider, StorageConfig } from '../index';
import { BlobServiceClient } from '@azure/storage-blob';
import logger from '@/logger/index.js';
import { v4 as uuidv4 } from 'uuid';

export function createAzureProvider(config: StorageConfig): StorageProvider {
  if (!config.connectionString) {
    throw new Error('Azure storage connection string is required');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
  const defaultContainer = (config.containerName || config.bucket || 'seller-applications').toLowerCase();

  return {
    async uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }> {
      const containerName = (path || defaultContainer).toLowerCase();
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}${fileExt ? `.${fileExt}` : ''}`;

      try {
        await containerClient.createIfNotExists();
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: {
            blobContentType: file.mimetype,
          },
        });

        return {
          url: blockBlobClient.url,
          key: fileName,
        };
      } catch (error) {
        logger.error(`[STORAGE] Error subiendo a Azure Blob Storage (${containerName}): %o`, error);
        throw new Error('No se pudo subir el archivo a Azure Blob Storage.');
      }
    },

    async deleteFile(key: string, bucket?: string): Promise<void> {
      await this.deleteFiles([key], bucket);
    },

    async deleteFiles(keys: string[], bucket?: string): Promise<void> {
      if (keys.length === 0) return;
      const containerName = (bucket || defaultContainer).toLowerCase();
      const containerClient = blobServiceClient.getContainerClient(containerName);

      try {
        for (const key of keys) {
          const blockBlobClient = containerClient.getBlockBlobClient(key);
          await blockBlobClient.deleteIfExists();
        }
      } catch (error) {
        logger.error(`[STORAGE] Error eliminando archivos de Azure Blob Storage (${containerName}): %o`, error);
        throw new Error('No se pudieron eliminar los archivos de Azure Blob Storage.');
      }
    },

    getFileUrl(key: string, bucket?: string): string {
      const containerName = (bucket || defaultContainer).toLowerCase();
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(key);
      return blockBlobClient.url;
    },
  };
}
