import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';
import dotenv from 'dotenv';
import path from 'path';
import logger from '@/logger/index.js';

// Load .env only when environment variables are not already provided
if (!process.env.DATABASE_CONNECTION_STRING) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const prisma = new PrismaClient();

const predefinedUsers = [
  {
    email: 'owner@agromarket.com',
    name: 'AgroMarket Owner',
    role: 'admin',
    password: '11111111',
  },
  {
    email: 'seller@agromarket.com',
    name: 'AgroMarket Seller',
    role: 'seller',
    password: '11111111',
  },
  {
    email: 'buyer@agromarket.com',
    name: 'AgroMarket Buyer',
    role: 'buyer',
    password: '11111111',
  },
];

async function ensureUser({ email, name, role, password }: { email: string; name: string; role: string; password: string; }) {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      emailVerified: true,
      phoneVerified: true,
    },
    create: {
      name,
      email,
      role,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: 'credential',
        accountId: user.id,
      },
    },
    update: {
      password: hashedPassword,
      userId: user.id,
    },
    create: {
      userId: user.id,
      providerId: 'credential',
      accountId: user.id,
      type: 'email',
      password: hashedPassword,
    },
  });

  return user;
}

async function ensureProduct(sellerId: string) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      title: 'Lote de prueba del vendedor',
      sellerId,
    },
  });

  if (existingProduct) return existingProduct;

  return prisma.product.create({
    data: {
      title: 'Lote de prueba del vendedor',
      description: 'Producto de prueba creado para el usuario vendedor.',
      price: 1200,
      currency: 'USD',
      category: 'Becerros',
      breed: 'Brahman',
      type: 'macho',
      weight: '180 Kg',
      location: 'Lara',
      heads: 30,
      age: '6 meses',
      condition: 'Excelente',
      verified: true,
      img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600',
      sellerId,
    },
  });
}

async function ensureTransaction(buyerId: string, sellerId: string, productId: number) {
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      buyerId,
      sellerId,
      productId,
    },
  });

  if (existingTransaction) return existingTransaction;

  return prisma.transaction.create({
    data: {
      buyerId,
      sellerId,
      productId,
      amount: 1500,
      currency: 'USD',
      status: 'pending',
    },
  });
}

async function main() {
  logger.info('🌱 Starting seed...');

  const seededUsers: Record<string, { id: string; role: string; email: string }> = {};

  for (const userData of predefinedUsers) {
    const user = await ensureUser(userData);
    seededUsers[userData.email] = user;
    logger.info(`✅ Seed user ready: ${user.email} (${user.role})`);
  }

  const seller = seededUsers['seller@agromarket.com'];
  const buyer = seededUsers['buyer@agromarket.com'];

  if (seller && buyer) {
    const product = await ensureProduct(seller.id);
    await ensureTransaction(buyer.id, seller.id, product.id);
    logger.info('✅ Sample product and transaction seeded.');
  }

  logger.info('🚀 Seeding completed successfully');
}

main()
  .catch((e) => {
    logger.error('❌ Seeding error:');
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
