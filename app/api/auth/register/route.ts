import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      console.error("Missing required fields");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (password.length < 8) {
      console.error("Password too short");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
