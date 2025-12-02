# Digital Products & Downloads Setup Guide

This guide explains how to set up and use the downloadable digital products feature for Quant by Boji.

## Overview

The digital products system allows you to sell downloadable files (PDFs, ZIPs, etc.) with secure access control:

- **Secure checkout** via Stripe (requires authentication)
- **Automatic entitlements** created after successful payment
- **Gated downloads** - only paying customers can access files
- **S3-backed storage** with presigned URLs (no public links)
- **Beautiful UI** for browsing and downloading purchased products

## Database Schema

Three new models have been added to Prisma:

### Product
Maps to a Stripe Price ID and contains one or more downloadable assets.

### Asset
Individual files (PDF, ZIP, etc.) stored in S3, linked to a Product.

### Entitlement
Links a User to a Product they own (created after successful Stripe payment).

## Setup Steps

### 1. Update Database Schema

Run the Prisma migration to add the new models:

```bash
npx prisma migrate dev --name add_digital_products
```

This will create the `Product`, `Asset`, and `Entitlement` tables.

### 2. Seed Sample Data

The seed script creates a sample product and asset with placeholders:

```bash
npm run db:seed
```

**IMPORTANT:** Update the placeholders in your database:

1. **Product.stripePriceId**: Replace `STRIPE_PRICE_ID_PLACEHOLDER` with your actual Stripe Price ID
2. **Asset.storageKey**: Replace `S3_STORAGE_KEY_PLACEHOLDER` with your S3 key (e.g., `products/tv-tradovate-diy/QuantByBoji_Kit.zip`)

You can update these via Prisma Studio or directly in the database:

```bash
npx prisma studio
```

### 3. Configure AWS S3

#### Create S3 Bucket

1. Log into AWS Console
2. Create a new S3 bucket (e.g., `quantbyboji-downloads`)
3. Keep the bucket **private** (block all public access)

#### Create IAM User

1. Go to IAM → Users → Add User
2. Create a user with **programmatic access**
3. Attach policy: `AmazonS3FullAccess` (or create a custom policy with GetObject permissions)
4. Save the **Access Key ID** and **Secret Access Key**

#### Upload Files

Upload your digital product files to S3:

```bash
aws s3 cp QuantByBoji_Kit.zip s3://your-bucket/products/tv-tradovate-diy/QuantByBoji_Kit.zip
```

The storage path should match the `storageKey` in your Asset model.

### 4. Configure Environment Variables

Add these variables to your `.env` file (see `env.template`):

```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=quantbyboji-downloads

# Make sure these are also set
NEXT_PUBLIC_SITE_URL=https://www.quantbyboji.com
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Install Dependencies

The new AWS SDK packages need to be installed:

```bash
npm install
```

This will install:
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `tsx` (for running the seed script)

### 6. Test Locally

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Sign in to your account

3. Test checkout flow:
   - Make a POST request to `/api/stripe/checkout` with `{ priceId: "your_stripe_price_id" }`
   - Complete the Stripe checkout
   - You'll be redirected to `/account/downloads`

4. Verify webhook creates entitlement:
   - Use Stripe CLI to forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks`
   - Complete a test purchase
   - Check that an `Entitlement` was created in the database

5. Test download:
   - Visit `/account/downloads`
   - Click "Download" on your purchased product
   - Should redirect to a presigned S3 URL

## API Endpoints

### POST `/api/stripe/checkout`

Creates a Stripe Checkout Session for purchasing a digital product.

**Request:**
```json
{
  "priceId": "price_xxx"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Requirements:**
- User must be authenticated
- Product must exist in database and be active
- User cannot already own the product

### POST `/api/webhooks`

Handles Stripe webhook events (already exists, updated to create entitlements).

**Events handled:**
- `checkout.session.completed` - Creates entitlement for digital products
- Legacy subscription events still supported

### GET `/api/download/[assetId]`

Securely downloads a digital asset.

**Requirements:**
- User must be authenticated
- User must have an active entitlement for the product
- Asset must be active
- Returns presigned S3 URL (redirects automatically)

## Pages

### `/account/downloads`

User dashboard showing all purchased products and downloadable assets.

**Features:**
- Lists all products user owns
- Shows purchase date
- Download buttons for each asset
- Success/cancel messages after checkout
- Beautiful, responsive UI

## Adding New Products

### Option 1: Via Prisma Studio

1. Open Prisma Studio: `npx prisma studio`
2. Create a new Product with your Stripe Price ID
3. Create Asset(s) linked to the Product
4. Upload files to S3 matching the storage keys

### Option 2: Via Code/Script

```typescript
// Create product
const product = await prisma.product.create({
  data: {
    name: "My New Product",
    slug: "my-new-product",
    description: "Product description",
    stripePriceId: "price_xxx", // From Stripe
    price: 4900, // $49.00 in cents
    currency: "usd",
    active: true,
  },
});

// Create asset
const asset = await prisma.asset.create({
  data: {
    productId: product.id,
    name: "MyFile.zip",
    description: "File description",
    storageKey: "products/my-new-product/MyFile.zip",
    fileSize: 1024000, // bytes
    contentType: "application/zip",
    active: true,
  },
});
```

## Security Features

✅ **Authentication required** - All endpoints check user login status
✅ **Entitlement verification** - Downloads require proof of purchase
✅ **No public links** - Files stored in private S3 bucket
✅ **Presigned URLs** - Time-limited (5 minutes) download links
✅ **Idempotent webhooks** - Duplicate payments won't create duplicate entitlements
✅ **Expiration support** - Optional expiry dates for time-limited access

## Troubleshooting

### "S3 is not configured" error

The download endpoint will return a 503 error if AWS credentials are missing. Check:
- Environment variables are set correctly
- `.env` file is loaded
- AWS credentials are valid

### "You do not have access to this file"

The user doesn't have an active entitlement. Check:
- User completed payment successfully
- Webhook created the entitlement
- Entitlement is active and not expired

### "Product not found" during checkout

The Stripe Price ID doesn't match any Product in the database. Verify:
- Product exists in database
- `stripePriceId` matches exactly
- Product is active

### Download link expires too quickly

Presigned URLs expire in 5 minutes by default. To extend:

Edit `lib/s3.ts` and change the `expiresIn` parameter:

```typescript
const url = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
```

## Production Deployment

### Vercel Environment Variables

Add all required environment variables to Vercel:

1. Go to Project Settings → Environment Variables
2. Add each variable from `env.template`
3. Deploy

### Stripe Webhook

Update your Stripe webhook endpoint to point to production:

```
https://www.quantbyboji.com/api/webhooks
```

### S3 CORS (Optional)

If you want to display file metadata or thumbnails, configure CORS on your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["https://www.quantbyboji.com"],
    "ExposeHeaders": []
  }
]
```

## File Structure

```
app/
  api/
    stripe/
      checkout/
        route.ts          # Create checkout session
    webhooks/
      route.ts            # Handle Stripe webhooks (updated)
    download/
      [assetId]/
        route.ts          # Secure download endpoint
  account/
    downloads/
      page.tsx            # User downloads dashboard

lib/
  s3.ts                   # S3 helper functions

prisma/
  schema.prisma           # Database schema (updated)
  seed.ts                 # Seed script for sample data
```

## Next Steps

1. ✅ Run database migration
2. ✅ Run seed script and update placeholders
3. ✅ Set up AWS S3 bucket and IAM user
4. ✅ Configure environment variables
5. ✅ Upload product files to S3
6. ✅ Test purchase flow locally
7. ✅ Deploy to production
8. ✅ Update Stripe webhook endpoint
9. ✅ Test end-to-end on production

## Support

If you need help or encounter issues, check:
- Console logs for error messages
- Stripe webhook logs in Stripe Dashboard
- Database records in Prisma Studio
- S3 bucket permissions and file uploads
