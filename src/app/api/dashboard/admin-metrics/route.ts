import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const teamCount = await prisma.team.count();
  const mentorCount = await prisma.user.count({
    where: { role: "MENTOR" },
  });

  const latestTeams = await prisma.team.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      status: true,
    },
  });

  const latestMentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    teamCount,
    mentorCount,
    latestTeams,
    latestMentors,
  });
}
