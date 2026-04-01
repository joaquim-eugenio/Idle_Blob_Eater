// Stub: replace with RevenueCat, Play Billing, or Stripe when deploying to production.
// Each function simulates a successful purchase after a short delay.

export function purchaseProduct(productId: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`[IAP Stub] Purchasing product: ${productId}`);
    setTimeout(() => resolve(true), 800);
  });
}

export function restorePurchases(): Promise<string[]> {
  return new Promise((resolve) => {
    console.log('[IAP Stub] Restoring purchases');
    setTimeout(() => resolve([]), 500);
  });
}
