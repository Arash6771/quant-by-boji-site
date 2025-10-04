import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { stripe, PRICE_IDS, siteUrl, enableCheckout } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  if (!enableCheckout) {
    return NextResponse.json({ error: "Checkout disabled. Join the waitlist." }, { status: 503 });
  }

  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { product = "DIY", mode = "payment" } = await req.json().catch(() => ({}));
  const price = PRICE_IDS[product as keyof typeof PRICE_IDS];
  if (!price) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      customer_email: session.user.email,
      metadata: { 
        product,
        userId: (session.user as any).id || session.user.email 
      },
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Stripe error" }, { status: 500 });
  }
}
