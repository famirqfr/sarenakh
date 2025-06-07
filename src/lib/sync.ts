import { prisma } from "@/lib/db";

export async function syncTeamPoints(teamId: string): Promise<number> {
  const result = await prisma.teamActionLog.aggregate({
    where: { teamId },
    _sum: { delta: true },
  });

  const totalPoints = result._sum.delta ?? 0;

  await prisma.team.update({
    where: { id: teamId },
    data: { points: totalPoints },
  });

  return totalPoints;
}
