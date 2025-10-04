import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getVerificationEmailHTML } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    // Send verification email
    const baseUrl = (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quantbyboji.com').trim();
    const verificationUrl = `${baseUrl}/api/auth/verify-email/confirm?token=${token}&email=${email}`;
    
    // Send email with beautiful template
    await sendEmail({ 
      to: email, 
      subject: 'Verify your email - Quant by Boji', 
      html: getVerificationEmailHTML(verificationUrl)
    });
    
    console.log('Verification email sent to:', email);

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ error: "Invalid verification link" }, { status: 400 });
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
      return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
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
      return NextResponse.json({ error: "Verification link has expired" }, { status: 400 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
