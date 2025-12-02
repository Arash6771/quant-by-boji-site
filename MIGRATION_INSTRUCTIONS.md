# Database Migration Instructions

## Before Running Migration

**IMPORTANT:** The Prisma schema has been updated with new models for digital products. Follow these steps to safely migrate your database.

## Step 1: Review Schema Changes

New models added:
- `Product` - Digital products mapped to Stripe Price IDs
- `Asset` - Downloadable files stored in S3
- `Entitlement` - Links users to products they own

Updated models:
- `User` - Added `entitlements` relation

## Step 2: Create Migration

Run this command to create and apply the migration:

```bash
npx prisma migrate dev --name add_digital_products
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate Prisma Client

## Step 3: Verify Migration

Check that the tables were created:

```bash
npx prisma studio
```

You should see three new tables:
- `Product`
- `Asset`
- `Entitlement`

## Step 4: Seed Sample Data

Run the seed script to create a sample product:

```bash
npm run db:seed
```

## Step 5: Update Placeholders

In Prisma Studio or your database, update:

1. `Product.stripePriceId` - Replace placeholder with real Stripe Price ID
2. `Asset.storageKey` - Replace placeholder with real S3 key

## Production Migration

For production deployment on Vercel:

### Option 1: Automatic (Recommended)

Vercel will automatically run migrations if you have the build command:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Option 2: Manual

Run migration manually before deploying:

```bash
# Set DATABASE_URL to production database
DATABASE_URL="your_production_db_url" npx prisma migrate deploy
```

## Rollback (If Needed)

If you need to rollback:

```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

Then manually revert the schema changes in `prisma/schema.prisma`.

## Backup Recommendation

Before migrating production:

1. Backup your database
2. Test migration on a staging database first
3. Run migration during low-traffic period

## Support

If you encounter issues:
- Check Prisma logs for error messages
- Verify database connection in `.env`
- Ensure `DATABASE_URL` and `DIRECT_URL` are correct
- Check that existing models (User, Purchase, Subscription) were not affected
