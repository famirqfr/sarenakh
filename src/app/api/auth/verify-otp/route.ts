import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  const record = await prisma.oTP.findUnique({ where: { phone } });

  if (!record || record.code !== otp) {
    return NextResponse.json({ error: "کد تأیید اشتباه است" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    return NextResponse.json({ error: "کاربری یافت نشد" }, { status: 404 });
  }

  const payload = { id: user.id, role: user.role };
  const TEN_HOURS_IN_SECONDS = 10 * 60 * 60;

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const response = NextResponse.json({ success: true });

  response.headers.append(
    "Set-Cookie",
    [
      `access_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TEN_HOURS_IN_SECONDS}`,
      `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        60 * 60 * 24 * 7
      }`,
    ].join(", ")
  );

  // optionally delete OTP after use
  await prisma.oTP.delete({ where: { phone } });

  return response;
}
