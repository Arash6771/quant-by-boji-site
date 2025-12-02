import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDownloadUrl, isS3Configured } from '@/lib/s3';

export const dynamic = 'force-dynamic';

/**
 * GET /api/download/[assetId]
 * Securely download a digital asset
 * - Requires authentication
 * - Validates user entitlement
 * - Returns presigned S3 URL or streams file
 */
export async function GET(
  request: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to download files' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { assetId } = params;

    // Get asset with product information
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        product: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    if (!asset.active) {
      return NextResponse.json(
        { error: 'This asset is no longer available' },
        { status: 410 }
      );
    }

    // Check if user has entitlement for this product
    const entitlement = await prisma.entitlement.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: asset.productId,
        },
      },
    });

    if (!entitlement || !entitlement.active) {
      return NextResponse.json(
        { error: 'You do not have access to this file. Please purchase the product first.' },
        { status: 403 }
      );
    }

    // Check if entitlement has expired
    if (entitlement.expiresAt && entitlement.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Your access to this file has expired' },
        { status: 403 }
      );
    }

    // Generate download URL
    if (!isS3Configured()) {
      // S3 not configured - return stub response for development
      console.warn('⚠️ S3 is not configured. Returning stub download response.');
      return NextResponse.json({
        error: 'Download service is not configured',
        message: 'S3 storage is not set up. Please configure AWS credentials.',
        asset: {
          id: asset.id,
          name: asset.name,
          storageKey: asset.storageKey,
        },
        todo: [
          'Set up AWS S3 bucket',
          'Configure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET',
          'Upload files to S3 with the storageKey: ' + asset.storageKey,
        ],
      }, { status: 503 });
    }

    try {
      // Generate presigned URL (expires in 5 minutes)
      const downloadUrl = await getDownloadUrl(asset.storageKey, 300);

      // Log download event (optional - for analytics)
      console.log(`📥 User ${user.email} downloading: ${asset.name} (${asset.id})`);

      // Redirect to the presigned URL
      return NextResponse.redirect(downloadUrl);
    } catch (s3Error: any) {
      console.error('S3 download error:', s3Error);
      return NextResponse.json(
        {
          error: 'Failed to generate download link',
          message: s3Error.message || 'Unknown S3 error',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process download request' },
      { status: 500 }
    );
  }
}
