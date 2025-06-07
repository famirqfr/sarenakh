import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const superadmin = await prisma.user.upsert({
    where: { phone: "09157006752" },
    update: {},
    create: {
      firstName: "امیرمحمد",
      lastName: "غفاری",
      phone: "09157006752",
      role: "SUPERADMIN",
    },
  });

  console.log("✅ Superadmin created:", superadmin);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
