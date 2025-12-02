import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
// TODO: Configure AWS credentials in environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

const S3_BUCKET = process.env.S3_BUCKET || '';

/**
 * Generate a presigned URL for downloading a file from S3
 * @param storageKey - The S3 object key (file path in bucket)
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned download URL
 */
export async function getDownloadUrl(
  storageKey: string,
  expiresIn: number = 300
): Promise<string> {
  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET environment variable is not configured');
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials are not configured');
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: storageKey,
  });

  // Generate presigned URL that expires in the specified time
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Check if S3 is properly configured
 * @returns true if S3 is configured, false otherwise
 */
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET
  );
}

/**
 * Get a stub download URL for development/testing when S3 is not configured
 * @param assetId - The asset ID
 * @returns A stub URL
 */
export function getStubDownloadUrl(assetId: string): string {
  return `/api/download/${assetId}/stub`;
}
