import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomInt } from "crypto";
import axios from "axios";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { error: "شماره تلفن الزامی است" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    return NextResponse.json(
      { error: "کاربری با این شماره یافت نشد" },
      { status: 404 }
    );
  }

  const otp = randomInt(100000, 999999).toString();

  await prisma.oTP.upsert({
    where: { phone },
    update: { code: otp, createdAt: new Date() },
    create: { phone, code: otp, createdAt: new Date() },
  });

  await axios.post(
    "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
    {
      code: "uqm76i5fd5eflr7", 
      sender: "+983000505",
      recipient: phone,
      variable: { code: otp },
    },
    {
      headers: {
        apikey: "OWYxYWYxODQtM2M3NC00ZDE3LWE0ZTEtY2RiZTIwZTdjMTU4ZWY5ZjIxZGE2MWViMDY2MmMzODZkYjRiMDlkZmI5ZWY=",
        "Content-Type": "application/json",
      },
    }
  );

  return NextResponse.json({ success: true });
}
