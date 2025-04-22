import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const start = new Date();
  console.log("Seeding Roles...");

  const permissions = await prisma.permission.findMany();
  await prisma.role.createMany({
    data: [
      {
        id: "admin",
        label: "Admin",
        description: "Can do everything",
      },
      {
        id: "user",
        label: "User",
        description: "Can do everything except admin stuff",
      }
    ],
    skipDuplicates: true,
  });
  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => {
      return {
        roleId: "admin",
        permissionId: permission.id,
      };
    }),
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
