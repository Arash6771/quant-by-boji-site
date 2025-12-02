# Quick Start: Digital Products

## 🚀 Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration
```bash
npx prisma migrate dev --name add_digital_products
```

### 3. Seed Sample Product
```bash
npm run db:seed
```

### 4. Update Placeholders

Open Prisma Studio:
```bash
npx prisma studio
```

Update these fields:
- **Product** → `stripePriceId`: Replace `STRIPE_PRICE_ID_PLACEHOLDER` with your real Stripe Price ID
- **Asset** → `storageKey`: Replace `S3_STORAGE_KEY_PLACEHOLDER` with your S3 path (e.g., `products/tv-tradovate-diy/QuantByBoji_Kit.zip`)

### 5. Configure Environment Variables

Copy from `env.template` and add to `.env`:

```bash
# AWS S3 (required for downloads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your-bucket-name

# Already configured (verify these exist)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://www.quantbyboji.com
```

### 6. Upload Files to S3

```bash
aws s3 cp QuantByBoji_Kit.zip s3://your-bucket/products/tv-tradovate-diy/QuantByBoji_Kit.zip
```

## 📦 Usage

### Add Purchase Button to Any Page

```tsx
import PurchaseButton from '@/components/PurchaseButton';

export default function ProductPage() {
  return (
    <PurchaseButton 
      priceId="price_xxx"  // Your Stripe Price ID
      productName="TV Tradovate DIY Kit"
      buttonText="Buy Now - $49"
    />
  );
}
```

### User Flow

1. User clicks "Buy Now" button
2. If not logged in → redirects to sign in
3. If logged in → creates Stripe Checkout Session
4. User completes payment on Stripe
5. Webhook creates Entitlement automatically
6. User redirected to `/account/downloads`
7. User can download their files securely

## 🧪 Testing

### Test Purchase Flow (Local)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Forward Stripe webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```

3. Visit your app and make a test purchase

4. Check `/account/downloads` to see your product

### Test Without S3 (Development Mode)

If S3 is not configured, the download endpoint will return a helpful error message with setup instructions. This allows you to test the purchase flow before setting up S3.

## 📊 Database Models

```
User
  ↓ (has many)
Entitlement ← (links) → Product
                          ↓ (has many)
                        Asset (files)
```

## 🔗 Key Routes

| Route | Purpose |
|-------|---------|
| `POST /api/stripe/checkout` | Create checkout session |
| `POST /api/webhooks` | Handle Stripe events |
| `GET /api/download/[assetId]` | Secure file download |
| `/account/downloads` | User downloads page |

## ⚙️ Admin Tasks

### Add a New Product

Via Prisma Studio (`npx prisma studio`):

1. Create **Product**:
   - `name`: "My Product"
   - `slug`: "my-product"
   - `stripePriceId`: "price_xxx" (from Stripe)
   - `price`: 4900 (in cents)
   - `active`: true

2. Create **Asset**:
   - `productId`: Select the product
   - `name`: "MyFile.zip"
   - `storageKey`: "products/my-product/MyFile.zip"
   - `active`: true

3. Upload file to S3 matching the storage key

### Manually Grant Access

Create an **Entitlement**:
- `userId`: User ID
- `productId`: Product ID
- `active`: true

## 🔒 Security

✅ Authentication required for checkout
✅ Entitlement verification for downloads
✅ Private S3 bucket (no public access)
✅ Presigned URLs (expire in 5 minutes)
✅ Idempotent webhook handling

## 🐛 Common Issues

**"S3 is not configured"**
→ Add AWS credentials to `.env`

**"Product not found"**
→ Verify `stripePriceId` matches in database

**"You do not have access"**
→ Check entitlement was created in webhook

**Download link doesn't work**
→ Verify file exists in S3 at the storage key path

## 📚 Full Documentation

See `DIGITAL_PRODUCTS_SETUP.md` for complete documentation.
