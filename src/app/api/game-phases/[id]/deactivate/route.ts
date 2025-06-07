import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "توکن یافت نشد" }, { status: 401 });
  }

  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json(
      { message: "شناسه مرحله ارسال نشده است" },
      { status: 400 }
    );
  }

  try {
    const updatedPhase = await prisma.gamePhase.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.teamActionLog.create({
      data: {
        action: "phase_deactivation",
        phaseId: updatedPhase.id,
        userId: payload.id,
      },
    });

    return NextResponse.json(updatedPhase);
  } catch (error) {
    console.error("خطا در غیرفعالسازی مرحله:", error);
    return NextResponse.json({ message: "خطای داخلی سرور" }, { status: 500 });
  }
}
