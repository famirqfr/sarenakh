import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MentorType, Prisma, Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateUserSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف داشته باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف داشته باشد"),
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن نامعتبر است"),
  role: z.enum(["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]),
  mentorType: z.nativeEnum(MentorType).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "توکن وجود ندارد" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role: Role };

    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { error: "شما اجازه ویرایش کاربر را ندارید" },
        { status: 403 }
      );
    }

    const userId = params.id;
    if (!userId) {
      return NextResponse.json(
        { error: "شناسه کاربر نامعتبر است" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده‌ها نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, role, mentorType } = parsed.data;

    // بررسی نقش‌هایی که اجازه ساخت توسط نقش فعلی را دارند
    const allowedRolesToUpdate: Role[] =
      payload.role === "SUPERADMIN"
        ? ["SUPERADMIN", "ADMIN", "MENTOR", "CASHIER"]
        : ["ADMIN", "MENTOR", "CASHIER"];

    if (!allowedRolesToUpdate.includes(role)) {
      return NextResponse.json(
        { error: "شما اجازه انتساب این نقش را ندارید" },
        { status: 403 }
      );
    }

    // بررسی اینکه شماره تلفن تکراری نباشد (به جز کاربر فعلی)
    const existingUser = await prisma.user.findFirst({
      where: {
        phone,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره تلفن قبلاً برای کاربر دیگری ثبت شده است" },
        { status: 409 }
      );
    }

    // بررسی وجود کاربر قبل از ویرایش
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        role,
        mentorType: role === "MENTOR" ? mentorType : null,
      },
    });

    return NextResponse.json({ success: true, message: "کاربر ویرایش شد" });
  } catch (err) {
    console.error("Update User Error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "کاربر وجود ندارد یا قبلاً حذف شده است" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "خطای داخلی سرور در ویرایش کاربر" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "توکن وجود ندارد" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role: Role };

    if (!["SUPERADMIN", "ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { error: "شما اجازه حذف کاربر را ندارید" },
        { status: 403 }
      );
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "شناسه کاربر نامعتبر است" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json(
      { message: "کاربر با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE User Error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "کاربر قبلاً حذف شده یا وجود ندارد" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "خطای داخلی سرور رخ داده است" },
      { status: 500 }
    );
  }
}
