import { NextResponse } from "next/server";
import { stripe, PRICE_IDS, siteUrl, enableCheckout } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!enableCheckout) {
    return NextResponse.json({ error: "Checkout disabled. Join the waitlist." }, { status: 503 });
  }

  const { product = "DIY", mode = "payment" } = await req.json().catch(() => ({}));
  const price = PRICE_IDS[product as keyof typeof PRICE_IDS];
  if (!price) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      metadata: { product },
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Stripe error" }, { status: 500 });
  }
}
