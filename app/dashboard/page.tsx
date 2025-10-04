'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startCheckout } from '@/lib/checkout';

interface UserAccess {
  hasDIY: boolean;
  hasFULL: boolean;
  hasADDON: boolean;
  activePurchases: string[];
  activeSubscriptions: string[];
}

interface Purchase {
  id: string;
  productType: string;
  amount: number;
  purchaseDate: string;
  status: string;
}

interface Subscription {
  id: string;
  productType: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAccess, setUserAccess] = useState<UserAccess | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const [accessRes, purchasesRes, subscriptionsRes] = await Promise.all([
        fetch('/api/user/access'),
        fetch('/api/user/purchases'),
        fetch('/api/user/subscriptions')
      ]);

      if (accessRes.ok) {
        const accessData = await accessRes.json();
        setUserAccess(accessData);
      }

      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData);
      }

      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.name || session.user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg font-semibold text-gray-900">{session.user.email}</p>
              <p className="text-xs text-green-600">✓ Verified</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Purchases</h3>
              <p className="text-lg font-semibold text-gray-900">{purchases.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
              <p className="text-lg font-semibold text-gray-900">{subscriptions.length}</p>
            </div>
          </div>
        </div>

        {/* Access Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Access & Packages</h2>
          {userAccess ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 ${userAccess.hasDIY ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">DIY Package</h3>
                <p className="text-sm text-gray-600">$500 one-time</p>
                <div className={`mt-2 px-2 py-1 rounded text-xs ${userAccess.hasDIY ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {userAccess.hasDIY ? 'Active' : 'Not Active'}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>• Complete source code</p>
                  <p>• Step-by-step README</p>
                  <p>• No live sessions included</p>
                </div>
                {!userAccess.hasDIY && (
                  <button
                    onClick={() => startCheckout('DIY')}
                    className="mt-2 w-full bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Purchase
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 ${userAccess.hasFULL ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">Full Package</h3>
                <p className="text-sm text-gray-600">$900 one-time</p>
                <div className={`mt-2 px-2 py-1 rounded text-xs ${userAccess.hasFULL ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {userAccess.hasFULL ? 'Active' : 'Not Active'}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>• Everything in DIY</p>
                  <p>• 60-min live session</p>
                  <p>• Deploy & validate pipeline</p>
                  <p>• 1 week troubleshooting</p>
                </div>
                {!userAccess.hasFULL && (
                  <button
                    onClick={() => startCheckout('FULL')}
                    className="mt-2 w-full bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Purchase
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 ${userAccess.hasADDON ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <h3 className="font-medium">Add-on Package</h3>
                <p className="text-sm text-gray-600">$200 one-time</p>
                <div className={`mt-2 px-2 py-1 rounded text-xs ${userAccess.hasADDON ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {userAccess.hasADDON ? 'Active' : 'Not Active'}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>• Extra 60-min live session</p>
                  <p>• Small customizations</p>
                  <p>• Payload tweaks</p>
                  <p>• Retest on new symbols</p>
                </div>
                {!userAccess.hasADDON && (
                  <button
                    onClick={() => startCheckout('ADDON')}
                    className="mt-2 w-full bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Purchase
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading access information...</p>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
          {purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {purchase.productType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatAmount(purchase.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(purchase.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No purchases yet.</p>
          )}
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{subscription.productType}</h3>
                      <p className="text-sm text-gray-600">
                        Next billing: {formatDate(subscription.currentPeriodEnd)}
                      </p>
                      {subscription.cancelAtPeriodEnd && (
                        <p className="text-sm text-orange-600">
                          Will cancel at period end
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active subscriptions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
