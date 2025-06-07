import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "توکن یافت نشد" }, { status: 401 });
  }

  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    await prisma.gamePhase.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const updatedPhase = await prisma.gamePhase.update({
      where: { id },
      data: { isActive: true },
    });

    await prisma.teamActionLog.create({
      data: {
        action: "phase_activation",
        phaseId: updatedPhase.id,
        userId: payload.id,
      },
    });

    return NextResponse.json(updatedPhase);
  } catch (error) {
    console.error("خطای فعال‌سازی مرحله:", error);
    return NextResponse.json({ message: "خطای داخلی سرور" }, { status: 500 });
  }
}
