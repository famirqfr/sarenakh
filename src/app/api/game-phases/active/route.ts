import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const activePhase = await prisma.gamePhase.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
      },
    });

    if (!activePhase) {
      return NextResponse.json(
        { error: "No active phase found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: activePhase });
  } catch (error) {
    console.error("Error fetching active phase:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
