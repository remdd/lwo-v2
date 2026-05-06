import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Simple hash function for demo passwords (use bcrypt in production)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@wildlifeoasis.co.uk',
      hashedPassword: hashPassword('ChangeMe123!'), // Change this!
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', adminUser.username);

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '01234567890',
    },
  });
  console.log('✅ Created test customer:', customer.email);

  // Create sample experiences
  const meetTheMeerkats = await prisma.experience.upsert({
    where: { slug: 'meet-the-meerkats' },
    update: {},
    create: {
      strapiId: 1,
      name: 'Meet the Meerkats',
      slug: 'meet-the-meerkats',
      description: 'Get up close and personal with our meerkat family',
      price: 25.00,
      duration: 30,
      maxCapacity: 4,
      isActive: true,
    },
  });

  const feedTheLemurs = await prisma.experience.upsert({
    where: { slug: 'feed-the-lemurs' },
    update: {},
    create: {
      strapiId: 2,
      name: 'Feed the Lemurs',
      slug: 'feed-the-lemurs',
      description: 'Help our keepers feed the ring-tailed lemurs',
      price: 20.00,
      duration: 20,
      maxCapacity: 6,
      isActive: true,
    },
  });

  const keeperForDay = await prisma.experience.upsert({
    where: { slug: 'keeper-for-a-day' },
    update: {},
    create: {
      strapiId: 3,
      name: 'Keeper for a Day',
      slug: 'keeper-for-a-day',
      description: 'Shadow our keepers for a full day experience',
      price: 150.00,
      duration: 480,
      maxCapacity: 2,
      isActive: true,
    },
  });

  console.log('✅ Created experiences:', [
    meetTheMeerkats.name,
    feedTheLemurs.name,
    keeperForDay.name,
  ]);

  // Create availability rules
  const weekdayRule = await prisma.availabilityRule.create({
    data: {
      experienceId: meetTheMeerkats.id,
      dayOfWeek: null, // null = applies to all days
      startDate: new Date('2026-01-01'),
      endDate: null,
      startTime: '10:00',
      endTime: '16:00',
      isBlackout: false,
    },
  });

  console.log('✅ Created availability rule for:', meetTheMeerkats.name);

  // Create sample booking (without payment for simplicity)
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      experienceId: meetTheMeerkats.id,
      bookingDate: new Date('2026-06-15'),
      bookingTime: '14:00',
      participants: 2,
      pricePerPerson: 25.00,
      totalPrice: 50.00,
      status: 'CONFIRMED',
      specialRequests: 'Birthday treat for my daughter!',
    },
  });

  console.log('✅ Created sample booking:', booking.id);

  // Create sample products
  const tshirt = await prisma.product.upsert({
    where: { slug: 'lwo-tshirt' },
    update: {},
    create: {
      strapiId: 101,
      name: 'LWO T-Shirt',
      slug: 'lwo-tshirt',
      description: 'Official Lakeland Wildlife Oasis t-shirt',
      price: 15.99,
      stock: 50,
      isActive: true,
    },
  });

  const plushToy = await prisma.product.upsert({
    where: { slug: 'meerkat-plush' },
    update: {},
    create: {
      strapiId: 102,
      name: 'Meerkat Plush Toy',
      slug: 'meerkat-plush',
      description: 'Adorable meerkat soft toy',
      price: 12.99,
      stock: 30,
      isActive: true,
    },
  });

  console.log('✅ Created products:', [tshirt.name, plushToy.name]);

  // Create sample order
  const order = await prisma.order.upsert({
    where: { orderNumber: 'ORD-2026-001' },
    update: {},
    create: {
      customerId: customer.id,
      orderNumber: 'ORD-2026-001',
      subtotal: 28.98,
      shippingCost: 0,
      total: 28.98,
      status: 'PAID',
      shippingAddress: {
        name: 'John Doe',
        address1: '123 Main Street',
        city: 'Dalton-in-Furness',
        postcode: 'LA15 8JR',
        country: 'GB',
      },
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 1,
            priceEach: 15.99,
            total: 15.99,
          },
          {
            productId: plushToy.id,
            quantity: 1,
            priceEach: 12.99,
            total: 12.99,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample order:', order.orderNumber);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
