import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const phases = await prisma.gamePhase.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
        isActive: true, // فرض بر اینکه این فیلد وجود داره
      },
    });

    const activeIndex = phases.findIndex((p) => p.isActive);
    if (activeIndex === -1) {
      return NextResponse.json(
        { error: "هیچ مرحله فعالی یافت نشد" },
        { status: 400 }
      );
    }

    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        actionLogs: {
          where: {
            action: "cashbox-solved",
          },
          select: {
            phaseId: true,
          },
        },
      },
    });

    const result = teams.map((team) => {
      const solvedPhaseIds = new Set(
        team.actionLogs.map((log) => log.phaseId).filter(Boolean)
      );

      const progress = phases.map((phase, index) => {
        const isSolved = solvedPhaseIds.has(phase.id);

        let status: "solved" | "not-solved" | "pending" = "pending";

        if (index < activeIndex) {
          status = isSolved ? "solved" : "not-solved";
        } else if (index === activeIndex) {
          status = isSolved ? "solved" : "pending";
        }

        return {
          phaseId: phase.id,
          phaseTitle: phase.title,
          status,
        };
      });

      return {
        teamId: team.id,
        teamName: team.name,
        progress,
      };
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error building progress map:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مسیر پیشرفت تیم‌ها" },
      { status: 500 }
    );
  }
}
