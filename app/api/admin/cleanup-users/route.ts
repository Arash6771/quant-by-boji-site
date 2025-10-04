import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    // Security: Add a simple password check
    const { adminPassword, email } = await request.json();
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (email) {
      // Delete specific user by email
      const deleted = await prisma.user.delete({
        where: { email }
      });
      
      return NextResponse.json({ 
        message: `Deleted user: ${email}`,
        user: deleted 
      });
    } else {
      // Delete all unverified users (test accounts)
      const deleted = await prisma.user.deleteMany({
        where: {
          emailVerified: null
        }
      });
      
      return NextResponse.json({ 
        message: `Deleted ${deleted.count} unverified users` 
      });
    }
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint to list all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminPassword = searchParams.get('password');
    
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ 
      count: users.length,
      users 
    });
  } catch (error: any) {
    console.error("List users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
