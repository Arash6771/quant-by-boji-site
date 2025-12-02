import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a sample product
  // TODO: Replace PLACEHOLDER with your actual Stripe Price ID for the TV Tradovate DIY product
  const product = await prisma.product.upsert({
    where: { slug: 'tv-tradovate-diy' },
    update: {},
    create: {
      name: 'TV Tradovate DIY Kit',
      slug: 'tv-tradovate-diy',
      description: 'Complete DIY kit for TV Tradovate integration with documentation and resources',
      stripePriceId: 'STRIPE_PRICE_ID_PLACEHOLDER', // TODO: Replace with actual Stripe Price ID
      price: 4900, // $49.00 in cents
      currency: 'usd',
      active: true,
    },
  });

  console.log('✅ Created/Updated product:', product.name);

  // Create sample asset for the product
  // TODO: Replace PLACEHOLDER with your actual S3 storage key
  const asset = await prisma.asset.upsert({
    where: { id: 'seed-asset-1' },
    update: {},
    create: {
      id: 'seed-asset-1',
      productId: product.id,
      name: 'QuantByBoji_Kit.zip',
      description: 'Complete kit package including documentation, scripts, and setup guides',
      storageKey: 'S3_STORAGE_KEY_PLACEHOLDER', // TODO: Replace with actual S3 key (e.g., 'products/tv-tradovate-diy/QuantByBoji_Kit.zip')
      fileSize: null, // Update with actual file size when uploading to S3
      contentType: 'application/zip',
      active: true,
    },
  });

  console.log('✅ Created/Updated asset:', asset.name);

  console.log('🎉 Seed completed successfully!');
  console.log('\n⚠️  IMPORTANT: Update the following placeholders in the database:');
  console.log('   1. Product.stripePriceId: Replace STRIPE_PRICE_ID_PLACEHOLDER with your actual Stripe Price ID');
  console.log('   2. Asset.storageKey: Replace S3_STORAGE_KEY_PLACEHOLDER with your actual S3 key');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
