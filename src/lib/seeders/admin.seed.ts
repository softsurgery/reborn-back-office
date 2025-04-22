import { PrismaClient } from "@prisma/client";
import { seedAdminData } from "./data/seed-admin.data";

const prisma = new PrismaClient();

async function main() {
  const start = new Date();
  console.log("Seeding Admin...");

  await prisma.user.createMany({
    data: [await seedAdminData()],
    skipDuplicates: true,
  });

  const end = new Date();
  console.log(`Seeding completed: ${end.getTime() - start.getTime()}ms`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
