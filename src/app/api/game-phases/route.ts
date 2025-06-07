import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client/edge";

const checkAuth = async () => {
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

export async function GET() {
  try {
    const phases = await prisma.gamePhase.findMany({
      include: {
        allowedRoles: {
          select: {
            role: true,
          },
        },
      },
    });

    const result = phases.map((phase) => ({
      ...phase,
      allowedRoles: phase.allowedRoles.map((r) => r.role),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await checkAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      rewardPoints,
      duration,
      isActive,
      allowedRoles,
    } = body;

    if (
      !title ||
      !description ||
      isNaN(rewardPoints) ||
      isNaN(duration) ||
      !Array.isArray(allowedRoles)
    ) {
      return NextResponse.json({ error: "مقادیر نامعتبر" }, { status: 400 });
    }

    const phase = await prisma.gamePhase.create({
      data: {
        title,
        description,
        rewardPoints,
        duration,
        isActive: !!isActive,
        allowedRoles: {
          create: allowedRoles.map((role: Role) => ({ role })),
        },
      },
      include: { allowedRoles: true },
    });

    return NextResponse.json({
      ...phase,
      allowedRoles: phase.allowedRoles.map((r) => r.role),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
