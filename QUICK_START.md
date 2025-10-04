# 🚀 Quick Start Guide - Get Your Payment System Running

## 1. **Set Up Environment Variables**

Copy the environment template:
```bash
cp env.template .env.local
```

**Required Variables to Fill:**
```env
# Database (Use Supabase for free PostgreSQL)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your_generated_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Your existing Stripe values
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_DIY="price_..."
STRIPE_PRICE_ID_FULL="price_..."
STRIPE_PRICE_ID_ADDON="price_..."

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 2. **Set Up Database (Recommended: Supabase)**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the URI and add it to your `.env.local`

## 3. **Initialize Database**

```bash
# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init
```

## 4. **Update Stripe Webhook**

In your Stripe Dashboard:
1. Go to Webhooks
2. Add these events to your existing webhook:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## 5. **Test the System**

```bash
# Start development server
npm run dev
```

**Test Flow:**
1. Visit `http://localhost:3000`
2. Click "Get Started" → Sign up for account
3. Click any "Buy" button → Should redirect to sign in if not logged in
4. Complete checkout in Stripe test mode
5. Check dashboard at `/dashboard`

## 6. **What Happens Now**

✅ **Users must sign in before checkout**
✅ **All payments are tracked in your database**
✅ **Users get immediate access after payment**
✅ **Complete audit trail of all transactions**
✅ **Dashboard shows user access levels**

## 🎯 **Key URLs**

- **Homepage**: `http://localhost:3000`
- **Sign Up**: `http://localhost:3000/auth/signup`
- **Sign In**: `http://localhost:3000/auth/signin`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Database Admin**: `npx prisma studio`

## 🔧 **Troubleshooting**

**Database Issues:**
```bash
# Reset database if needed
npx prisma migrate reset
npx prisma migrate dev --name init
```

**Authentication Issues:**
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

**Payment Issues:**
- Verify webhook is receiving events in Stripe Dashboard
- Check console logs for webhook errors
- Ensure all price IDs are correct

## 🎉 **You're Ready!**

Your payment system now has:
- ✅ User authentication and management
- ✅ Secure payment processing
- ✅ Access control based on purchases
- ✅ Complete transaction tracking
- ✅ Professional user dashboard

**No more guessing who paid for what - everything is tracked!** 🚀
