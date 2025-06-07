import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client/edge";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN", "MENTOR"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { teamId, action, delta } = body;

    if (!teamId || !action || isNaN(delta)) {
      return NextResponse.json(
        { error: "داده‌ها ناقص یا نامعتبرند" },
        { status: 400 }
      );
    }

    let phaseId: string | undefined = undefined;
    const activePhase = await prisma.gamePhase.findFirst({
      where: { isActive: true },
      select: { id: true },
    });
    phaseId = activePhase?.id || undefined;

    if (!activePhase && ["MENTOR"].includes(payload.role)) {
      return NextResponse.json(
        {
          error: "در حال حاضر هیچ مرحله ای فعال نیست",
        },
        { status: 400 }
      );
    }

    const [log, updatedTeam] = await prisma.$transaction([
      prisma.teamActionLog.create({
        data: {
          teamId,
          userId: payload.id,
          action,
          delta,
          phaseId: phaseId,
        },
      }),
      prisma.team.update({
        where: { id: teamId },
        data: {
          points: { increment: delta },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      log,
      newPoints: updatedTeam.points,
    });
  } catch (error) {
    console.error("log-action error:", error);
    return NextResponse.json({ error: "خطا در ثبت عملیات" }, { status: 500 });
  }
}
