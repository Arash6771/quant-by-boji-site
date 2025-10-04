import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' },
      select: {
        id: true,
        productType: true,
        amount: true,
        purchaseDate: true,
        status: true,
      }
    });
    
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
