// File: src/utils/prisma.ts
// Module responsible for backend functionality.

import { PrismaClient } from '@prisma/client';
import { CONFIG } from '@/config/env.config.js';

const buildDatabaseUrl = () => {
  if (!CONFIG.DATABASE_CONNECTION_STRING) return CONFIG.DATABASE_CONNECTION_STRING;
  try {
    const url = new URL(CONFIG.DATABASE_CONNECTION_STRING);
    if (CONFIG.DATABASE_CONNECTION_LIMIT) {
      url.searchParams.set('connection_limit', String(CONFIG.DATABASE_CONNECTION_LIMIT));
    }
    return url.toString();
  } catch {
    return CONFIG.DATABASE_CONNECTION_STRING;
  }
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: buildDatabaseUrl(),
    },
  },
});

export default prisma;