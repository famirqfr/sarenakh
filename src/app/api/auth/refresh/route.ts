import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "رفرش توکن موجود نیست" },
      { status: 401 }
    );
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 900,
    });

    return response;
  } catch {
    const response = NextResponse.json(
      { error: "توکن نامعتبر" },
      { status: 403 }
    );

    response.cookies.set("access_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}
