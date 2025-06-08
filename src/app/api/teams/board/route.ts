import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MENTOR_ACTIONS = [
  "mentor-help-simple",
  "mentor-help-professional",
  "mentor-help-special",
];

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        points: true, // ← امتیاز مستقیماً از جدول team
        actionLogs: {
          select: {
            action: true,
          },
        },
      },
    });

    const enriched = teams.map((team) => {
      let mentorCount = 0;
      let cashboxCount = 0;

      for (const log of team.actionLogs) {
        if (MENTOR_ACTIONS.includes(log.action)) {
          mentorCount += 1;
        }
        if (log.action === "cashbox-visit") {
          cashboxCount += 1;
        }
      }

      return {
        id: team.id,
        name: team.name,
        points: team.points ?? 0,
        _mentorCount: mentorCount,
        _cashboxCount: cashboxCount,
      };
    });

    const sorted = enriched
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (a._mentorCount !== b._mentorCount)
          return a._mentorCount - b._mentorCount;
        return a._cashboxCount - b._cashboxCount;
      })
      .map(({ id, name, points }) => ({ id, name, points }));

    return NextResponse.json({ teams: sorted });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست تیم‌ها" },
      { status: 500 }
    );
  }
}
