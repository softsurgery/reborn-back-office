import { PrismaClient } from "@prisma/client";
import { permissions } from "../data/permission.data";
import container from "@/lib/container";

export async function seedPermissions() {
  const prisma = new PrismaClient();

  const appMetadataService = container.SeederService;

  try {
    const upsertPromises = permissions.map((permission) =>
      prisma.permission.upsert({
        where: { label: permission.label },
        update: {
          description: permission.description,
        },
        create: {
          label: permission.label,
          description: permission.description,
        },
      })
    );
    await Promise.all(upsertPromises);
    await appMetadataService.confirmSeederObject("permissions");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  } finally {
    await prisma.$disconnect();
  }
}
