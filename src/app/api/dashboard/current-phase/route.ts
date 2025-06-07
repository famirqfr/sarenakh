import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const phase = await prisma.gamePhase.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!phase) {
    return NextResponse.json({ active: false });
  }

  const now = new Date();
  const passedMs = now.getTime() - phase.createdAt.getTime();
  const passedMinutes = Math.floor(passedMs / 60000);
  const remaining = Math.max(phase.duration - passedMinutes, 0);

  return NextResponse.json({
    active: true,
    id: phase.id,
    title: phase.title,
    duration: phase.duration,
    remaining,
    createdAt: phase.createdAt,
  });
}
