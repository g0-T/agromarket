const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Force Metro to resolve symlinks natively (Crucial for pnpm!)
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// 2. Explicitly watch your local node_modules and the virtual .pnpm store directory
config.watchFolders = [
  projectRoot,
  path.resolve(projectRoot, 'node_modules/.pnpm'),
  // Support pnpm hoisted layout when running inside Docker (workspace root /app)
  path.resolve(projectRoot, '../../node_modules/.pnpm')
];

// 3. Make sure Metro explicitly paths down into the absolute module directories
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  // Include workspace node_modules (hoisted by pnpm)
  path.resolve(projectRoot, '../../node_modules'),
];

module.exports = config;