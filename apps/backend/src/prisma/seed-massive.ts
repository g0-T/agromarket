import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando sembrado masivo...');

    const defaultPassword = '11111111';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@agromarket.com' },
        update: {
            name: 'Admin AgroMarket',
            role: 'admin',
            emailVerified: true,
            phoneVerified: true,
        },
        create: {
            name: 'Admin AgroMarket',
            email: 'admin@agromarket.com',
            role: 'admin',
            emailVerified: true,
            phoneVerified: true,
        },
    });

    await prisma.account.upsert({
        where: {
            providerId_accountId: {
                providerId: 'credential',
                accountId: admin.id,
            },
        },
        update: {
            password: hashedPassword,
            userId: admin.id,
        },
        create: {
            userId: admin.id,
            providerId: 'credential',
            accountId: admin.id,
            type: 'email',
            password: hashedPassword,
        },
    });

    const testUser = await prisma.user.upsert({
        where: { email: 'user@agromarket.com' },
        update: {
            name: 'Usuario Prueba',
            role: 'buyer',
            emailVerified: true,
            phoneVerified: true,
        },
        create: {
            name: 'Usuario Prueba',
            email: 'user@agromarket.com',
            role: 'buyer',
            emailVerified: true,
            phoneVerified: true,
        },
    });

    await prisma.account.upsert({
        where: {
            providerId_accountId: {
                providerId: 'credential',
                accountId: testUser.id,
            },
        },
        update: {
            password: hashedPassword,
            userId: testUser.id,
        },
        create: {
            userId: testUser.id,
            providerId: 'credential',
            accountId: testUser.id,
            type: 'email',
            password: hashedPassword,
        },
    });

    console.log('✅ Admin y usuario de prueba creados con contraseña 11111111.');

    const usersData = [];
    for (let i = 1; i <= 1000; i++) {
        usersData.push({
            email: `usuario${i}@agromarket.com`,
            name: `Productor o Comprador ${i}`,
            role: i % 2 === 0 ? 'seller' : 'buyer',
            emailVerified: true,
            phoneVerified: true,
        });
    }
    await prisma.user.createMany({ data: usersData });
    console.log('✅ 1,000 usuarios creados.');

    const users = await prisma.user.findMany({ select: { id: true, role: true } });
    const sellers = users.filter(u => u.role === 'seller');
    const buyers = users.filter(u => u.role === 'buyer');

    const productsData = [];
    const categorias = ['Becerros', 'Vacas', 'Novillas', 'Toros'];
    const tipos = ['Machos', 'Hembras', 'Cría'];
    const ubicaciones = ['Lara', 'Mérida', 'Miranda', 'Zulia'];

    for (let i = 1; i <= 10000; i++) {
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        productsData.push({
            title: `Lote de Becerros Brahman Nro ${i}`,
            description: `Excelente estado fitosanitario, lote número ${i} de prueba.`,
            price: Math.floor(Math.random() * 5000) + 500,
            currency: 'USD',
            category: categorias[Math.floor(Math.random() * categorias.length)],
            breed: 'Brahman',
            type: tipos[Math.floor(Math.random() * tipos.length)],
            weight: `${Math.floor(Math.random() * 300) + 100} Kg`,
            location: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
            heads: Math.floor(Math.random() * 50) + 1,
            age: `${Math.floor(Math.random() * 5) + 1} años`,
            condition: 'Excelente',
            img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600',
            sellerId: randomSeller.id,
        });
    }
    await prisma.product.createMany({ data: productsData });
    console.log('✅ 10,000 productos creados.');

    const products = await prisma.product.findMany({ select: { id: true, sellerId: true } });
    const transactionsData: Array<{
        buyerId: string;
        sellerId: string;
        productId: number;
        amount: number;
        currency: string;
        status: string;
    }> = [];

    for (let i = 1; i <= 2000; i++) {
        const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        transactionsData.push({
            buyerId: randomBuyer.id,
            sellerId: randomProduct.sellerId,
            productId: randomProduct.id,
            amount: Math.floor(Math.random() * 2000) + 100,
            currency: 'USD',
            status: 'COMPLETED',
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('app.current_user_role', 'admin', true)`;
        await tx.transaction.createMany({ data: transactionsData });
    });
    console.log('✅ 2,000 transacciones simuladas creadas.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
