import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client/edge";

export async function GET() {
  const setting = await prisma.gameSetting.findUnique({
    where: { key: "INITIAL_TEAM_POINTS" },
  });
  return NextResponse.json({ value: setting?.value || "1000" });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token)
    return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 });
  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { value } = await req.json();
  if (!value || isNaN(value)) {
    return NextResponse.json(
      { error: "مقدار وارد شده نامعتبر است" },
      { status: 400 }
    );
  }
  const updated = await prisma.gameSetting.upsert({
    where: { key: "INITIAL_TEAM_POINTS" },
    create: { key: "INITIAL_TEAM_POINTS", value },
    update: { value },
  });
  return NextResponse.json({ success: true, value: updated.value });
}
