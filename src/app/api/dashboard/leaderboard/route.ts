import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const teams = await prisma.team.findMany({
    where: { status: "ACTIVE" },
    include: {
      actionLogs: {
        select: { action: true },
      },
    },
  });

  const ranked = teams.map((team) => {
    const mentorHelp = team.actionLogs.filter((log) =>
      log.action.startsWith("mentor-help-")
    ).length;
    const cashboxVisit = team.actionLogs.filter((log) =>
      log.action.startsWith("cashbox-visit")
    ).length;

    return {
      id: team.id,
      name: team.name,
      points: team.points,
      mentorHelp,
      cashboxVisit,
    };
  });

  ranked.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (a.mentorHelp !== b.mentorHelp) return a.mentorHelp - b.mentorHelp;
    return a.cashboxVisit - b.cashboxVisit;
  });

  return NextResponse.json(ranked);
}
