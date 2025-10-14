import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a default user for testing requests
  const defaultUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('Default user created:', defaultUser);

  // Create a system user for automated operations
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@example.com' },
    update: {},
    create: {
      name: 'System User',
      email: 'system@example.com',
      password: hashedPassword,
    },
  });

  console.log('System user created:', systemUser);

  // Create some sample items
  const item1 = await prisma.item.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Laptop',
      description: 'Gaming laptop',
      stock: 10,
      unit: 'pcs',
      category: 'Electronics',
    },
  });

  const item2 = await prisma.item.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Mouse',
      description: 'Wireless mouse',
      stock: 25,
      unit: 'pcs',
      category: 'Electronics',
    },
  });

  console.log('Sample items created:', item1, item2);

  // Create some sample requests and logs
  const request1 = await prisma.request.create({
    data: {
      userId: systemUser.id,
      itemId: item1.id,
      quantity: 5,
      status: 'completed',
    },
  });

  await prisma.requestLog.create({
    data: {
      requestId: request1.id,
      action: 'deposit',
      user: 'System',
      notes: 'Initial deposit',
    },
  });

  const request2 = await prisma.request.create({
    data: {
      userId: systemUser.id,
      itemId: item2.id,
      quantity: 10,
      status: 'completed',
    },
  });

  await prisma.requestLog.create({
    data: {
      requestId: request2.id,
      action: 'deposit',
      user: 'System',
      notes: 'Initial deposit',
    },
  });

  console.log('Sample requests and logs created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
