import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '@/utils/prisma.js';

export const runDbAs = async <T>(options: { userId?: string; role?: string }, callback: (tx: Prisma.TransactionClient) => Promise<T>) => {
  return prisma.$transaction(async (tx) => {
    if (options.userId) {
      await tx.$executeRaw`SELECT set_config('app.current_user_id', ${options.userId}, true)`;
    }
    if (options.role) {
      await tx.$executeRaw`SELECT set_config('app.current_user_role', ${options.role}, true)`;
    }
    return callback(tx);
  });
};

export const runDbAsUser = async <T>(userId: string, role: string, callback: (tx: Prisma.TransactionClient) => Promise<T>) => {
  return runDbAs({ userId, role }, callback);
};

export const runDbAsAdmin = async <T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) => {
  return runDbAs({ role: 'admin' }, callback);
};
