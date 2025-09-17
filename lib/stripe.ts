import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const enableCheckout =
  (process.env.ENABLE_CHECKOUT || "false").toLowerCase() === "true";

export const PRICE_IDS = {
  DIY: process.env.STRIPE_PRICE_ID_DIY,
  FULL: process.env.STRIPE_PRICE_ID_FULL,
  ADDON: process.env.STRIPE_PRICE_ID_ADDON,
} as const;
