'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PurchaseButtonProps {
  priceId: string;
  productName: string;
  buttonText?: string;
  className?: string;
}

/**
 * PurchaseButton Component
 * 
 * Example usage:
 * <PurchaseButton 
 *   priceId="price_xxx" 
 *   productName="TV Tradovate DIY Kit"
 *   buttonText="Buy Now - $49"
 * />
 */
export default function PurchaseButton({
  priceId,
  productName,
  buttonText = 'Purchase',
  className = '',
}: PurchaseButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    // Check if user is logged in
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors
        if (data.redirectUrl) {
          // User already owns product, redirect to downloads
          router.push(data.redirectUrl);
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const defaultClassName = 'inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={loading || status === 'loading'}
        className={className || defaultClassName}
        aria-label={`Purchase ${productName}`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          buttonText
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
