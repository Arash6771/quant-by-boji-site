import { PRICE_IDS } from './stripe';

type ProductKey = keyof typeof PRICE_IDS;

export async function startCheckout(product: ProductKey) {
  const res = await fetch("/api/checkout", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ product }) 
  });
  
  const data = await res.json();
  
  if (data?.url) window.location.href = data.url;
  else alert(data?.error || "Checkout not available yet.");
}
