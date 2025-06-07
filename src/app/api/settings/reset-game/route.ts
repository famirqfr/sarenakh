import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import ExcelJS from "exceljs";

const RELATION_MAP: Record<string, string> = {
  father: "پدر",
  mother: "مادر",
  brother: "برادر",
  sister: "خواهر",
  friend: "دوست",
  family: "فامیل",
};

const ACTION_MAP: Record<string, string> = {
  "mentor-help-simple": "راهنمایی ساده",
  "mentor-help-professional": "راهنمایی حرفه‌ای",
  "mentor-help-special": "راهنمایی ویژه",
  "cashbox-visit": "مراجعه به صندوق",
  "cashbox-solved": "حل مرحله",
  "manual-add": "افزایش دستی امتیاز",
  "manual-deduct": "کاهش دستی امتیاز",
  "team-register": "ثبت‌نام تیم",
  "team-deactivated": "غیرفعال‌سازی تیم",
  "manual-update": "بروزرسانی دستی امتیاز",
  phase_deactivation: "غیرفعالسازی مرحله",
  phase_activation: "فعالسازی مرحله",
};

export const POST = async () => {
  try {
    const teams = await prisma.team.findMany({
      include: { members: true },
    });

    const logs = await prisma.teamActionLog.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        team: { select: { name: true } },
      },
      orderBy: { timestamp: "asc" },
    });

    const workbook = new ExcelJS.Workbook();

    // ------------------- Teams Sheet -------------------
    const teamSheet = workbook.addWorksheet("Teams");
    teamSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Points", key: "points" },
      { header: "Status", key: "status" },
      { header: "Created At", key: "createdAt" },
    ];
    teams.forEach((t) => teamSheet.addRow(t));

    // ------------------- Members Sheet (Grouped) -------------------
    const memberSheet = workbook.addWorksheet("TeamMembers");
    memberSheet.columns = [
      { header: "Team Name", key: "team" },
      { header: "First Name", key: "firstName" },
      { header: "Last Name", key: "lastName" },
      { header: "Phone", key: "phone" },
      { header: "Age", key: "age" },
      { header: "Relation", key: "relation" },
    ];

    teams.forEach((team) => {
      if (team.members.length === 0) return;
      memberSheet.addRow({ team: `▶ ${team.name}` });
      team.members.forEach((m) =>
        memberSheet.addRow({
          team: "",
          firstName: m.firstName,
          lastName: m.lastName,
          phone: m.phone,
          age: m.age,
          relation: RELATION_MAP[m.relation] || m.relation,
        })
      );
      memberSheet.addRow({});
    });

    // ------------------- Logs Sheet -------------------
    const logSheet = workbook.addWorksheet("Logs");
    logSheet.columns = [
      { header: "ID", key: "id" },
      { header: "User", key: "user" },
      { header: "Team", key: "team" },
      { header: "Action", key: "action" },
      { header: "Delta", key: "delta" },
      { header: "Timestamp", key: "timestamp" },
    ];
    logs.forEach((log) =>
      logSheet.addRow({
        id: log.id,
        user: `${log.user.firstName} ${log.user.lastName} (${log.user.phone})`,
        team: log.team?.name ?? "-",
        action: ACTION_MAP[log.action] || log.action,
        delta: log.delta,
        timestamp: log.timestamp,
      })
    );

    const buffer = await workbook.xlsx.writeBuffer();

    await prisma.teamActionLog.deleteMany({});
    await prisma.teamMember.deleteMany({});
    await prisma.team.deleteMany({});

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="game-backup-${new Date().toISOString()}.xlsx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (err) {
    console.error("Reset game error:", err);
    return NextResponse.json(
      { error: "خطا در ریست بازی و گرفتن خروجی" },
      { status: 500 }
    );
  }
};
