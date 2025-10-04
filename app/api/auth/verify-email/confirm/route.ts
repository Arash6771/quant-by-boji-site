import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid-verification', request.url));
    }

    // Find and validate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token
        }
      }
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/auth/signin?error=invalid-verification', request.url));
    }

    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token
          }
        }
      });
      return NextResponse.redirect(new URL('/auth/signin?error=expired-verification', request.url));
    }

    // Verify the user's email
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    });

    // Clean up the verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token
        }
      }
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url));

  } catch (error: any) {
    console.error("Email verification confirmation error:", error);
    return NextResponse.redirect(new URL('/auth/signin?error=verification-failed', request.url));
  }
}
