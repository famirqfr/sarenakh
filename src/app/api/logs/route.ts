import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;
  const action = searchParams.get("action") ?? undefined;
  const sort = searchParams.get("sort") ?? "desc";

  const logs = await prisma.teamActionLog.findMany({
    where: {
      teamId,
      userId,
      action,
    },
    include: {
      team: true,
      user: true,
    },
    orderBy: {
      timestamp: sort === "asc" ? "asc" : "desc",
    },
  });

  return Response.json(logs);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get("logId");

  if (!logId) return new Response("Missing logId", { status: 400 });

  const log = await prisma.teamActionLog.findUnique({
    where: { id: logId },
  });

  if (!log) return new Response("Log not found", { status: 404 });

  const delta = log.delta ?? 0;

  await prisma.$transaction(async (tx) => {
    await tx.teamActionLog.delete({ where: { id: logId } });

    if (delta !== 0) {
      await tx.team.update({
        where: { id: log.teamId },
        data: {
          points: {
            decrement: delta,
          },
        },
      });
    }
  });

  return Response.json({ success: true });
}