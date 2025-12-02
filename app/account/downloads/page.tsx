import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Downloads | Quant by Boji',
  description: 'Access your purchased digital products',
};

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  // Require authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/auth/signin?callbackUrl=/account/downloads');
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch user's entitlements with products and assets
  const entitlements = await prisma.entitlement.findMany({
    where: {
      userId: user.id,
      active: true,
    },
    include: {
      product: {
        include: {
          assets: {
            where: { active: true },
          },
        },
      },
    },
    orderBy: {
      grantedAt: 'desc',
    },
  });

  const showSuccess = searchParams.success === '1';
  const showCanceled = searchParams.canceled === '1';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Downloads</h1>
          <p className="mt-2 text-gray-600">
            Access and download your purchased digital products
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Purchase successful!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Your product is now available for download below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Canceled Message */}
        {showCanceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Purchase canceled
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your order was canceled. No charges were made.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {entitlements.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't purchased any downloadable products yet.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {entitlements.map((entitlement) => (
              <div
                key={entitlement.id}
                className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {entitlement.product.name}
                      </h2>
                      {entitlement.product.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {entitlement.product.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Purchased on{' '}
                        {new Date(entitlement.grantedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  {/* Assets */}
                  {entitlement.product.assets.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Available Downloads
                      </h3>
                      <div className="space-y-2">
                        {entitlement.product.assets.map((asset) => (
                          <div
                            key={asset.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center space-x-3">
                              <svg
                                className="h-8 w-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {asset.name}
                                </p>
                                {asset.description && (
                                  <p className="text-xs text-gray-500">
                                    {asset.description}
                                  </p>
                                )}
                                {asset.fileSize && (
                                  <p className="text-xs text-gray-400">
                                    {(asset.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                )}
                              </div>
                            </div>
                            <a
                              href={`/api/download/${asset.id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
