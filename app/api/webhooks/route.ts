import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, PRICE_IDS, siteUrl, enableCheckout } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // needed to access raw body
export const dynamic = "force-dynamic";

async function getRawBody(request: Request) {
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return new NextResponse("Missing webhook secret", { status: 400 });

  const raw = await getRawBody(request);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const productType = session.metadata?.product;
      const productId = session.metadata?.productId;
      const customerEmail = session.customer_details?.email;
      
      if (customerEmail && session.amount_total) {
        try {
          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email: customerEmail }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: customerEmail,
                name: session.customer_details?.name || null,
              }
            });
          }

          // Handle legacy subscription/purchase (productType)
          if (productType) {
            // Create purchase record for legacy products
            await prisma.purchase.create({
              data: {
                userId: user.id,
                stripeSessionId: session.id,
                productType: productType,
                amount: session.amount_total,
                currency: session.currency || 'usd',
                status: 'completed',
              }
            });
            console.log(`✅ User ${customerEmail} completed checkout for ${productType} (${session.id})`);
          }

          // Handle digital product purchase (productId)
          if (productId) {
            // Find the product
            const product = await prisma.product.findUnique({
              where: { id: productId }
            });

            if (product) {
              // Create or update entitlement (idempotent)
              await prisma.entitlement.upsert({
                where: {
                  userId_productId: {
                    userId: user.id,
                    productId: product.id,
                  }
                },
                update: {
                  active: true,
                  grantedAt: new Date(),
                },
                create: {
                  userId: user.id,
                  productId: product.id,
                  active: true,
                }
              });
              console.log(`✅ User ${customerEmail} purchased digital product: ${product.name} (${session.id})`);
            } else {
              console.error(`Product ${productId} not found for session ${session.id}`);
            }
          }
        } catch (error) {
          console.error('Error storing purchase:', error);
        }
      }
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      try {
        // Get customer details from Stripe
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
          let user = await prisma.user.findUnique({
            where: { email: customer.email }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: customer.email,
                name: customer.name || null,
              }
            });
          }

          // Determine product type from price ID
          const priceId = subscription.items.data[0]?.price.id;
          let productType = 'DIY';
          if (priceId === PRICE_IDS.FULL) productType = 'FULL';
          else if (priceId === PRICE_IDS.ADDON) productType = 'ADDON';

          // Upsert subscription record
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            update: {
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              stripeCustomerId: customerId,
              productType: productType,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }
          });

          console.log(`✅ Subscription ${subscription.status} for ${customer.email} (${subscription.id})`);
        }
      } catch (error) {
        console.error('Error handling subscription:', error);
      }
      break;

    case "customer.subscription.deleted":
      const deletedSub = event.data.object as Stripe.Subscription;
      try {
        await prisma.subscription.update({
          where: { stripeSubscriptionId: deletedSub.id },
          data: { status: 'canceled' }
        });
        console.log(`✅ Subscription canceled: ${deletedSub.id}`);
      } catch (error) {
        console.error('Error canceling subscription:', error);
      }
      break;

    default:
      console.log("ℹ️ Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
