import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const userCount = await prisma.user.count();
    const experienceCount = await prisma.experience.count();
    const productCount = await prisma.product.count();
    
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Experiences: ${experienceCount}`);
    console.log(`   Products: ${productCount}`);
    
    console.log('\n🎉 Database connectivity test passed!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
