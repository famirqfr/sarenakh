import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Role } from "@prisma/client/edge";

async function getUserPayload() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    throw { status: 401, message: "توکن موجود نیست" };
  }

  const payload = verifyToken(token) as { id: string; role: Role };
  return payload;
}

async function checkAccess(role: Role) {
  const activePhase = await prisma.gamePhase.findFirst({
    where: { isActive: true },
  });
  if (!activePhase) {
    throw { status: 400, message: "هیچ مرحله فعالی وجود ندارد" };
  }

  const allowed = await prisma.gamePhaseAllowedRole.findFirst({
    where: { gamePhaseId: activePhase.id, role },
  });
  if (!allowed) {
    throw { status: 403, message: "نقش شما در مرحله فعال مجاز نیست" };
  }

  return activePhase;
}

export async function GET() {
  try {
    const { role } = await getUserPayload();
    const activePhase = await checkAccess(role);

    const solvedTeams = await prisma.teamActionLog.findMany({
      where: {
        phaseId: activePhase.id,
        action: "cashbox-solved",
      },
      select: { teamId: true },
    });

    const solvedTeamIds = solvedTeams
      .map((t) => t.teamId)
      .filter((id): id is string => typeof id === "string");

    const teams = await prisma.team.findMany({
      where: {
        id: {
          notIn: solvedTeamIds,
        },
      },
      include: {
        leader: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (teams.length === 0) {
      return NextResponse.json({
        message: "همه تیم‌ها این مرحله را با موفقیت پشت سر گذاشته‌اند.",
        teams: [],
      });
    }

    return NextResponse.json({ teams });
  } catch (err) {
    console.error("GET /api/cashbox error:", err);
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "خطای داخلی" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id: userId, role } = await getUserPayload();
    const activePhase = await checkAccess(role);

    const { teamId, action } = await req.json();
    if (!teamId || !["solved", "not-solved"].includes(action)) {
      throw { status: 400, message: "داده‌های نامعتبر" };
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw { status: 404, message: "تیم پیدا نشد" };
    }

    const alreadyVisited = await prisma.teamActionLog.findFirst({
      where: { teamId, phaseId: activePhase.id, action: "cashbox-solved" },
    });

    if (alreadyVisited) {
      throw {
        status: 403,
        message:
          "این تیم قبلاً به صندوق مراجعه کرده است و این مرحله را با موفقیت حل کرده است.",
      };
    }

    const helpCostBoxSetting = await prisma.gameSetting.findUnique({
      where: { key: "HELP_COST_CASHIERS" },
    });

    if (!helpCostBoxSetting?.value) {
      throw { status: 500, message: "مقدار HELP_COST_CASHIERS تنظیم نشده است" };
    }

    const helpCost = parseInt(helpCostBoxSetting.value);
    const reward = activePhase.rewardPoints;

    const teamAfterPenalty = await prisma.team.update({
      where: { id: teamId },
      data: { points: { increment: -helpCost } },
    });

    await prisma.teamActionLog.create({
      data: {
        teamId,
        userId,
        action: "cashbox-visit",
        delta: -helpCost,
        phaseId: activePhase.id,
        timestamp: new Date(),
      },
    });

    let newPoints = teamAfterPenalty.points;

    if (action === "solved") {
      const finalTeam = await prisma.team.update({
        where: { id: teamId },
        data: { points: { increment: reward } },
      });

      await prisma.teamActionLog.create({
        data: {
          teamId,
          userId,
          action: "cashbox-solved",
          delta: reward,
          phaseId: activePhase.id,
          timestamp: new Date(),
        },
      });

      newPoints = finalTeam.points;
    }

    return NextResponse.json({ success: true, newPoints });
  } catch (err) {
    console.error("POST /api/cashbox error:", err);
    const error = err as { status?: number; message?: string };
    return NextResponse.json(
      { error: error.message || "خطای داخلی" },
      { status: error.status || 500 }
    );
  }
}
