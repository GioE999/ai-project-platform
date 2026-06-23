import { NextResponse } from "next/server";
import { createToken, createRefreshToken } from "@/lib/auth/middleware";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  // Placeholder: In production, validate OAuth2 code with Google
  const body = await request.json();
  const { email, name } = body;

  if (!email || !name) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Email and name required" },
      { status: 400 }
    );
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email, name } });
  }

  const token = await createToken({ id: user.id, email: user.email, name: user.name });
  const refreshToken = await createRefreshToken({ id: user.id, email: user.email, name: user.name });

  return NextResponse.json({
    token,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
