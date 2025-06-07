import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { MentorType, Prisma, Role } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

const userSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف داشته باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف داشته باشد"),
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن نامعتبر است"),
  role: z.enum(["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]),
  mentorType: z.nativeEnum(MentorType).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "توکن وجود ندارد" }, { status: 401 });
    }
    const payload = verifyToken(token) as { id: string; role: Role };

    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { error: "شما اجازه ساخت کاربر را ندارید" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده‌ها نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, role, mentorType } = parsed.data;

    const allowedRolesToCreate: Role[] =
      payload.role === "SUPERADMIN"
        ? ["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]
        : ["ADMIN", "MENTOR", "CASHIER"];

    if (!allowedRolesToCreate.includes(role)) {
      return NextResponse.json(
        { error: "شما اجازه ساخت کاربری با این نقش را ندارید" },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json(
        { error: "کاربری با این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        role,
        mentorType: role === "MENTOR" ? mentorType : null,
      },
    });

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create User Error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "خطای داخلی سرور رخ داده است" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "توکن وجود ندارد" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role: Role };

    let visibleRoles: Role[] = [];

    switch (payload.role) {
      case "SUPERADMIN":
        visibleRoles = ["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"];
        break;
      case "ADMIN":
        visibleRoles = ["ADMIN", "MENTOR", "CASHIER"];
        break;
      default:
        return NextResponse.json(
          { error: "شما اجازه مشاهده کاربران را ندارید" },
          { status: 403 }
        );
    }

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: visibleRoles,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        mentorType: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("User List Error:", err);
    return NextResponse.json(
      { error: "خطای داخلی سرور در دریافت کاربران" },
      { status: 500 }
    );
  }
}