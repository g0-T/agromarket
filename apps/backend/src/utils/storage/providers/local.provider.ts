import { StorageProvider, StorageConfig } from '../index';
import fs from 'fs/promises';
import path from 'path';
import logger from '@/logger/index.js';
import { v4 as uuidv4 } from 'uuid';

export function createLocalProvider(config: StorageConfig): StorageProvider {
  const basePath = config.basePath || path.join(process.cwd(), 'uploads');

  // Ensure base directory exists
  fs.mkdir(basePath, { recursive: true }).catch((error) => {
    logger.error(`[STORAGE] Error creando directorio base: %o`, error);
  });

  return {
    async uploadFile(file: Express.Multer.File, relativePath: string): Promise<{ url: string; key: string }> {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const fullRelativePath = path.join(relativePath, fileName);
      const fullPath = path.join(basePath, fullRelativePath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      try {
        await fs.writeFile(fullPath, file.buffer);

        // Return local file URL (assuming backend serves static files)
        const url = `/uploads/${fullRelativePath.replace(/\\/g, '/')}`;

        return {
          url,
          key: fullRelativePath
        };
      } catch (error) {
        logger.error(`[STORAGE] Error guardando archivo localmente: %o`, error);
        throw new Error('No se pudo guardar el archivo.');
      }
    },

    async deleteFile(key: string): Promise<void> {
      await this.deleteFiles([key]);
    },

    async deleteFiles(keys: string[]): Promise<void> {
      if (keys.length === 0) return;

      const deletePromises = keys.map(async (key) => {
        try {
          const fullPath = path.join(basePath, key);
          await fs.unlink(fullPath);
        } catch (error) {
          logger.error(`[STORAGE] Error eliminando archivo local ${key}: %o`, error);
        }
      });

      await Promise.all(deletePromises);
    },

    getFileUrl(key: string): string {
      return `/uploads/${key.replace(/\\/g, '/')}`;
    }
  };
}