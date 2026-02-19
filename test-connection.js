// Quick test to check database connection
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✓ Connection successful!', result);

        // Count users
        const userCount = await prisma.user.count();
        console.log('✓ User count:', userCount);

    } catch (error) {
        console.error('✗ Connection failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
