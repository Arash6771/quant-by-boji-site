# Quant by Boji

## Stripe Integration

### Development Testing Instructions

- Run: `npm run dev`

- In Stripe dashboard → Developers → Webhooks, add an endpoint to https://your-ngrok-domain/api/webhooks or use `stripe listen` locally:
  ```
  stripe listen --forward-to localhost:3000/api/webhooks
  ```

- Flip `ENABLE_CHECKOUT=true` in `.env.local` when you're ready to accept payments.

- Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` server-only; never reference them in client code.

### Environment Variables

Make sure your `.env.local` contains the following variables:

```
NEXT_PUBLIC_SITE_NAME=Quant by Boji
NEXT_PUBLIC_SITE_URL=https://quantbyboji.com
STRIPE_PRICE_ID_DIY=price_XXXX
STRIPE_PRICE_ID_FULL=price_YYYY
STRIPE_PRICE_ID_ADDON=price_ZZZZ
STRIPE_SECRET_KEY=sk_test_or_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
ENABLE_CHECKOUT=false
```

Replace the placeholder values with your actual Stripe API keys and product price IDs.

### Security Notes

- All Stripe-related secret keys are only used in server components and API routes
- Client-side checkout is triggered via the `/api/checkout` endpoint
- Webhooks are verified using Stripe signatures
