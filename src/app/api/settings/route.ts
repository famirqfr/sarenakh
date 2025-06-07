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

// مسیر GET و POST برای initial-points
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/initial-points")) {
    const setting = await prisma.gameSetting.findUnique({
      where: { key: "INITIAL_TEAM_POINTS" },
    });
    return NextResponse.json({
      value: setting?.value || "1000",
    });
  }

  if (url.pathname.endsWith("/help-costs")) {
    const simple = await prisma.gameSetting.findUnique({
      where: { key: "HELP_COST_MENTORING_SIMPLE" },
    });
    const professional = await prisma.gameSetting.findUnique({
      where: { key: "HELP_COST_MENTORING_PROFESSIONAL" },
    });
    return NextResponse.json({
      simple: simple?.value || "10",
      professional: professional?.value || "20",
    });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const auth = await checkAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();

  if (url.pathname.endsWith("/initial-points")) {
    const { value } = body;
    if (!value || isNaN(value)) {
      return NextResponse.json(
        { error: "مقدار وارد شده نامعتبر است" },
        { status: 400 }
      );
    }

    const updated = await prisma.gameSetting.upsert({
      where: { key: "INITIAL_TEAM_POINTS" },
      create: { key: "INITIAL_TEAM_POINTS", value },
      update: { value },
    });

    return NextResponse.json({ success: true, value: updated.value });
  }

  if (url.pathname.endsWith("/help-costs")) {
    const { simple, professional } = body;
    if (!simple || isNaN(simple) || !professional || isNaN(professional)) {
      return NextResponse.json(
        { error: "مقادیر وارد شده نامعتبر هستند" },
        { status: 400 }
      );
    }

    const [updatedSimple, updatedProfessional] = await Promise.all([
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_MENTORING_SIMPLE" },
        create: { key: "HELP_COST_MENTORING_SIMPLE", value: simple },
        update: { value: simple },
      }),
      prisma.gameSetting.upsert({
        where: { key: "HELP_COST_MENTORING_PROFESSIONAL" },
        create: {
          key: "HELP_COST_MENTORING_PROFESSIONAL",
          value: professional,
        },
        update: { value: professional },
      }),
    ]);

    return NextResponse.json({
      success: true,
      simple: updatedSimple.value,
      professional: updatedProfessional.value,
    });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
