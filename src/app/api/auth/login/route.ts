import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { error: "شماره تلفن الزامی است" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    return NextResponse.json(
      { error: "کاربری با این شماره یافت نشد" },
      { status: 404 }
    );
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const response = NextResponse.json({ success: true });

  response.headers.append(
    "Set-Cookie",
    [
      `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`,
      `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        60 * 60 * 24 * 7
      }`,
    ].join(", ")
  );

  return response;
}
