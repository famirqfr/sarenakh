import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client/edge";

const checkAuth = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

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
  { params }: { params: { id: string } }
) {
  const phase = await prisma.gamePhase.findUnique({ where: { id: params.id } });
  if (!phase) {
    return NextResponse.json({ error: "مرحله یافت نشد" }, { status: 404 });
  }
  return NextResponse.json(phase);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkAuth(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const { title, description, rewardPoints, duration, allowedRoles } = body;

  if (!title || !description || isNaN(rewardPoints) || isNaN(duration)) {
    return NextResponse.json({ error: "مقادیر نامعتبر" }, { status: 400 });
  }

  const updated = await prisma.gamePhase.update({
    where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  const auth = await checkAuth(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await prisma.gamePhase.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
