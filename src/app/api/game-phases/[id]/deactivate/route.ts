import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "توکن یافت نشد", status: 401 };
  }

  const payload = verifyToken(token) as { id: string; role: Role };
  if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
    return { error: "دسترسی غیرمجاز", status: 403 };
  }
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  }

  try {
    const updatedPhase = await prisma.gamePhase.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.teamActionLog.create({
      data: {
        action: `phase_deactivation`,
        phaseId: updatedPhase.id,
        userId: payload.id,
      },
    });
    return NextResponse.json(updatedPhase);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
