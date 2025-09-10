import { NextResponse } from "next/server";
import { stripe, PRICE_IDS, siteUrl, enableCheckout } from "@/lib/stripe";

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
      // TODO: mark access active by product in your DB
      console.log("✅ checkout.session.completed", event.data.object.id);
      break;
    default:
      console.log("ℹ️ Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
