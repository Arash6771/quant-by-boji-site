import { prisma } from "./prisma";

export type ProductTier = 'DIY' | 'FULL' | 'ADDON';

export interface UserAccess {
  hasDIY: boolean;
  hasFULL: boolean;
  hasADDON: boolean;
  activePurchases: string[];
  activeSubscriptions: string[];
}

/**
 * Check what access levels a user has based on their purchases and subscriptions
 */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  const [purchases, subscriptions] = await Promise.all([
    prisma.purchase.findMany({
      where: {
        userId,
        status: 'completed'
      },
      select: {
        productType: true,
        id: true
      }
    }),
    prisma.subscription.findMany({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date()
        }
      },
      select: {
        productType: true,
        id: true
      }
    })
  ]);

  const purchasedProducts = new Set(purchases.map(p => p.productType));
  const subscribedProducts = new Set(subscriptions.map(s => s.productType));
  
  // User has access if they either purchased or have active subscription
  const allProducts = new Set<string>();
  purchasedProducts.forEach(product => allProducts.add(product));
  subscribedProducts.forEach(product => allProducts.add(product));

  return {
    hasDIY: allProducts.has('DIY'),
    hasFULL: allProducts.has('FULL'),
    hasADDON: allProducts.has('ADDON'),
    activePurchases: purchases.map(p => p.id),
    activeSubscriptions: subscriptions.map(s => s.id)
  };
}

/**
 * Check if user has access to a specific product tier
 */
export async function hasProductAccess(userId: string, productTier: ProductTier): Promise<boolean> {
  const access = await getUserAccess(userId);
  
  switch (productTier) {
    case 'DIY':
      return access.hasDIY;
    case 'FULL':
      // FULL access includes DIY features
      return access.hasFULL || access.hasDIY;
    case 'ADDON':
      return access.hasADDON;
    default:
      return false;
  }
}

/**
 * Get user's highest tier access level
 */
export async function getUserTier(userId: string): Promise<ProductTier | null> {
  const access = await getUserAccess(userId);
  
  if (access.hasFULL) return 'FULL';
  if (access.hasADDON) return 'ADDON';
  if (access.hasDIY) return 'DIY';
  
  return null;
}

/**
 * Check if user has any paid access
 */
export async function hasPaidAccess(userId: string): Promise<boolean> {
  const access = await getUserAccess(userId);
  return access.hasDIY || access.hasFULL || access.hasADDON;
}
