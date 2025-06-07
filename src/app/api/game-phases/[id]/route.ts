import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export const runtime = "nodejs";

const checkAuth = async () => {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return { error: "توکن یافت نشد", status: 401 };
  }

  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return { error: "دسترسی غیرمجاز", status: 403 };
  }

  return { payload };
};

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const phase = await prisma.gamePhase.findUnique({ where: { id } });

  if (!phase) {
    return NextResponse.json({ error: "مرحله یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(phase);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await checkAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;
  const body = await req.json();
  const { title, description, rewardPoints, duration, allowedRoles } = body;

  if (!title || !description || isNaN(rewardPoints) || isNaN(duration)) {
    return NextResponse.json({ error: "مقادیر نامعتبر" }, { status: 400 });
  }

  const updated = await prisma.gamePhase.update({
    where: { id },
    data: {
      title,
      description,
      rewardPoints,
      duration,
      allowedRoles: {
        deleteMany: {},
        create: allowedRoles.map((role: Role) => ({ role })),
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await checkAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;
  await prisma.gamePhase.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
