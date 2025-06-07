import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const teamId = params.id;
    if (!teamId)
      return NextResponse.json(
        { error: "شناسه تیم ارسال نشده است" },
        { status: 400 }
      );

    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!existingTeam) {
      return NextResponse.json({ error: "تیم پیدا نشد" }, { status: 404 });
    }

    await prisma.teamActionLog.create({
      data: {
        teamId,
        userId: payload.id,
        action: "team-deactivated",
        delta: 0,
        timestamp: new Date(),
      },
    });

    await prisma.team.update({
      where: { id: teamId },
      data: {
        status: "INACTIVE",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Soft Delete Team Error:", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
