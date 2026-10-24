// Test script for storage providers
import logger from '@/logger/index.js';
import { createStorageConfig, getStorageProvider } from './storage.config';

async function testStorageProvider() {
  try {
    logger.info('Testing Storage Provider Configuration...');

    // Test configuration creation
    const config = createStorageConfig();
    logger.info('Configuration created:', {
      provider: config.provider,
      hasConnectionString: !!config.connectionString,
    });

    // Test provider instantiation
    const provider = await getStorageProvider();
    logger.info('Provider instantiated successfully');

    // Test provider interface
    const methods = ['uploadFile', 'deleteFile', 'deleteFiles', 'getFileUrl'] as const;
    const hasAllMethods = methods.every(method => typeof (provider as any)[method] === 'function');

    if (hasAllMethods) {
      logger.info('All required methods implemented');
    } else {
      logger.warn('Missing required methods');
    }

    logger.info('Storage provider test completed successfully!');
    logger.info(`Current provider: ${config.provider.toUpperCase()}`);

  } catch (error) {
    logger.error('Storage provider test failed:', error);
    process.exit(1);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testStorageProvider();
}

export { testStorageProvider };