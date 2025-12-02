import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/checkout
 * Create a Stripe Checkout Session for purchasing a digital product
 * Requires user to be logged in
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to make a purchase' },
        { status: 401 }
      );
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId is required' },
        { status: 400 }
      );
    }

    // Verify that the product exists in our database
    const product = await prisma.product.findUnique({
      where: { stripePriceId: priceId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.active) {
      return NextResponse.json(
        { error: 'Product is not available for purchase' },
        { status: 400 }
      );
    }

    // Check if user already owns this product
    const existingEntitlement = await prisma.entitlement.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    if (existingEntitlement?.active) {
      return NextResponse.json(
        { error: 'You already own this product', redirectUrl: '/account/downloads' },
        { status: 400 }
      );
    }

    // Get the app URL from environment
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/account/downloads?success=1`,
      cancel_url: `${appUrl}/account/downloads?canceled=1`,
      metadata: {
        userId: user.id,
        productId: product.id,
        productSlug: product.slug,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
