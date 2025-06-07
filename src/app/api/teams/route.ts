import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { Role, Team } from "@prisma/client/edge";
import { generateRandomTeamName } from "@/lib/teamNameGenerator";

const teamSchema = z.object({
  leader: z.object({
    firstName: z.string().min(2, "نام الزامی است"),
    lastName: z.string().min(2, "نام خانوادگی الزامی است"),
    phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
    age: z.number().int().positive("سن معتبر نیست"),
  }),
  members: z
    .array(
      z.object({
        firstName: z.string().min(2, "نام الزامی است"),
        lastName: z.string().min(2, "نام خانوادگی الزامی است"),
        phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
        age: z.number().int().positive("سن معتبر نیست"),
        relation: z.string().min(2, "نسبت الزامی است"),
      })
    )
    .min(1, "حداقل یک عضو وارد کنید"),
});

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const result = teamSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "داده‌ها نامعتبر است", details: result.error.format() },
        { status: 400 }
      );
    }

    const { leader, members } = result.data;
    const phoneExists = await prisma.teamMember.findFirst({
      where: { phone: leader.phone },
    });
    if (phoneExists) {
      return NextResponse.json(
        { error: "شماره تلفن سرگروه قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    const setting = await prisma.gameSetting.findUnique({
      where: { key: "INITIAL_TEAM_POINTS" },
    });
    const points = parseInt(setting?.value || "100", 10);
    const teamName = generateRandomTeamName();
    const allMembers = [{ ...leader, relation: "سرگروه" }, ...members];

    const createdTeam = await prisma.team.create({
      data: {
        name: teamName,
        points,
        status: "ACTIVE",
        members: { create: allMembers },
      },
    });

    const leaderRecord = await prisma.teamMember.findFirst({
      where: { phone: leader.phone, teamId: createdTeam.id },
    });
    await prisma.team.update({
      where: { id: createdTeam.id },
      data: { leaderId: leaderRecord!.id },
    });

    await prisma.teamActionLog.create({
      data: {
        teamId: createdTeam.id,
        userId: payload.id,
        action: "team-register",
        delta: points,
        timestamp: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, teamId: createdTeam.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create Team Error:", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const teams = await prisma.team.findMany({
      include: { leader: true, members: true },
      where: {
        NOT: { status: "INACTIVE" },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ teams });
  } catch (err) {
    console.error("Get Teams Error:", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
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

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token)
      return NextResponse.json({ error: "توکن موجود نیست" }, { status: 401 });

    const payload = verifyToken(token) as { id: string; role: Role };
    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { teamId, name, points } = await req.json();
    if (!teamId)
      return NextResponse.json(
        { error: "شناسه تیم ارسال نشده است" },
        { status: 400 }
      );

    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!existingTeam) {
      return NextResponse.json(
        { error: "تیم مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const updateData: Partial<Pick<Team, "name" | "points">> = {};
    if (name) updateData.name = name;
    if (typeof points === "number") updateData.points = points;

    await prisma.team.update({
      where: { id: teamId },
      data: updateData,
    });

    if (typeof points === "number" && points !== existingTeam.points) {
      const delta = points - existingTeam.points;

      await prisma.teamActionLog.create({
        data: {
          teamId,
          userId: payload.id,
          action: "manual-update",
          delta,
          timestamp: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update Team Error:", err);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
