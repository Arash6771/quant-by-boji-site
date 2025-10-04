# Quant by Boji - Setup Guide

This guide will help you set up the complete authentication and payment system for your Quant by Boji application.

## 🎯 What You Now Have

✅ **Complete User Management System**
- User registration and authentication
- Google OAuth integration (optional)
- Secure password hashing
- Session management with NextAuth.js

✅ **Database Integration**
- PostgreSQL database with Prisma ORM
- User, Purchase, and Subscription models
- Automatic user creation on payment
- Complete purchase and subscription tracking

✅ **Enhanced Payment System**
- Authentication-required checkout
- Automatic user account creation
- Purchase and subscription tracking
- Webhook handling for all payment events

✅ **User Dashboard**
- View access levels and active subscriptions
- Purchase history
- Subscription management
- Easy upgrade/purchase buttons

✅ **Access Control System**
- Middleware to protect premium routes
- Utility functions to check user permissions
- Tier-based access control (DIY, FULL, ADDON)

## 🚀 Setup Instructions

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create a database named 'quantbyboji'
createdb quantbyboji
```

**Option B: Cloud Database (Recommended for production)**
- Use [Supabase](https://supabase.com) (free tier available)
- Use [PlanetScale](https://planetscale.com) 
- Use [Railway](https://railway.app)
- Use [Neon](https://neon.tech)

### 2. Environment Variables

Copy `env.template` to `.env.local`:
```bash
cp env.template .env.local
```

Fill in your environment variables:

```env
# Database - Get from your database provider
DATABASE_URL="postgresql://username:password@localhost:5432/quantbyboji?schema=public"

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe (Your existing values)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_DIY=price_your_diy_price_id
STRIPE_PRICE_ID_FULL=price_your_full_price_id
STRIPE_PRICE_ID_ADDON=price_your_addon_price_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENABLE_CHECKOUT=true
```

### 3. Database Migration

Generate and run the database migration:
```bash
# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

### 4. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to your `.env.local`

### 5. Update Stripe Webhook

Add these events to your Stripe webhook:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`

### 6. Test the System

```bash
# Start development server
npm run dev
```

**Test Flow:**
1. Visit `http://localhost:3000/auth/signup` - Create account
2. Visit `http://localhost:3000/dashboard` - View dashboard
3. Click "Purchase" on any product - Test checkout
4. Complete payment in Stripe test mode
5. Return to dashboard - Verify access granted

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: JWT tokens with NextAuth.js
- **Route Protection**: Middleware guards premium content
- **CSRF Protection**: Built into NextAuth.js
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 🎛️ How It Works

### Payment Flow
1. User must be authenticated to access checkout
2. Stripe checkout includes user email automatically
3. Webhook receives payment confirmation
4. System creates/updates user record
5. Purchase/subscription stored in database
6. User gains immediate access to paid features

### Access Control
```typescript
// Check if user has specific product access
const hasAccess = await hasProductAccess(userId, 'FULL');

// Get user's access levels
const access = await getUserAccess(userId);
if (access.hasFULL) {
  // Show premium features
}

// Protect routes with middleware
// Routes under /dashboard/* and /premium/* require authentication
```

### User Management
- Users can sign up with email/password or Google
- Automatic account creation on first purchase
- Dashboard shows all purchases and subscriptions
- Access levels automatically calculated from active purchases/subscriptions

## 🚀 Next Steps

1. **Customize the UI** - Update colors, branding, and styling
2. **Add Premium Features** - Create protected routes under `/premium/*`
3. **Email Notifications** - Add welcome emails, payment confirmations
4. **Subscription Management** - Add cancel/upgrade functionality
5. **Analytics** - Track user behavior and conversion rates

## 🆘 Troubleshooting

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database server is running
- Ensure database exists

**Authentication Issues:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**Payment Issues:**
- Verify Stripe webhook is receiving events
- Check webhook secret matches
- Ensure price IDs are correct

**Access Control Issues:**
- Check user has completed purchase
- Verify webhook processed payment
- Check database for purchase/subscription records

## 📚 Key Files

- `lib/auth.ts` - NextAuth configuration
- `lib/prisma.ts` - Database client
- `lib/access-control.ts` - Permission checking utilities
- `app/api/webhooks/route.ts` - Stripe webhook handler
- `app/dashboard/page.tsx` - User dashboard
- `middleware.ts` - Route protection
- `prisma/schema.prisma` - Database schema

Your payment system is now production-ready with complete user management! 🎉
