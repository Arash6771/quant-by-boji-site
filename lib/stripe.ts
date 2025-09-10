import Stripe from "stripe";

// We need to use a type assertion here because the Stripe types may not include the latest API versions
export const stripe = (() => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any, // Using a type assertion to bypass strict type checking
  });
})();

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const enableCheckout = (process.env.ENABLE_CHECKOUT || "false").toLowerCase() === "true";

// Map safe price IDs by product key; never expose secrets here.
export const PRICE_IDS = {
  DIY: process.env.STRIPE_PRICE_ID_DIY,
  FULL: process.env.STRIPE_PRICE_ID_FULL,
  ADDON: process.env.STRIPE_PRICE_ID_ADDON,
};
