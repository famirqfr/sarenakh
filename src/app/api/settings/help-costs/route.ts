import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client/edge";

export async function GET() {
  const [simple, professional, special, box] = await Promise.all([
    prisma.gameSetting.findUnique({ where: { key: "HELP_COST_MENTORING_SIMPLE" } }),
    prisma.gameSetting.findUnique({ where: { key: "HELP_COST_MENTORING_PROFESSIONAL" } }),
    prisma.gameSetting.findUnique({ where: { key: "HELP_COST_MENTORING_SPECIAL" } }),
    prisma.gameSetting.findUnique({ where: { key: "HELP_COST_CASHIERS" } }),
  ]);

  return NextResponse.json({
    simple: simple?.value ?? "10",
    professional: professional?.value ?? "20",
    special: special?.value ?? "30",
    box: box?.value ?? "40",
  });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token)
    return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 });

  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const body = await req.json();
  const { simple, professional, special, box } = body;

  if ([simple, professional, special, box].some((val) => isNaN(val))) {
    return NextResponse.json(
      { error: "مقادیر وارد شده نامعتبر هستند" },
      { status: 400 }
    );
  }

  const [simpleUpdated, professionalUpdated, specialUpdated, boxUpdated] =
    await Promise.all([
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_MENTORING_SIMPLE" },
        create: { key: "HELP_COST_MENTORING_SIMPLE", value: simple },
        update: { value: simple },
      }),
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_MENTORING_PROFESSIONAL" },
        create: { key: "HELP_COST_MENTORING_PROFESSIONAL", value: professional },
        update: { value: professional },
      }),
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_MENTORING_SPECIAL" },
        create: { key: "HELP_COST_MENTORING_SPECIAL", value: special },
        update: { value: special },
      }),
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_CASHIERS" },
        create: { key: "HELP_COST_CASHIERS", value: box },
        update: { value: box },
      }),
    ]);

  return NextResponse.json({
    success: true,
    simple: simpleUpdated.value,
    professional: professionalUpdated.value,
    special: specialUpdated.value,
    box: boxUpdated.value,
  });
}
