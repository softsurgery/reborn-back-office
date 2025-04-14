import { PrismaClient } from "@prisma/client";
import { roles } from "../data/role.data";
import container from "@/lib/container";

export async function seedRoles() {
  const prisma = new PrismaClient();
  // const seederService = container.SeederService;
  try {
    // const upsertPromises = roles.map((role) =>
    //   prisma.role.upsert({
    //     where: { label: role.label },
    //     update: {
    //       label: role.label,
    //       description: role.description,
    //     },
    //     create: {
    //       label: role.label,
    //       description: role.description,
    //     },
    //   })
    // );
    // await Promise.all(upsertPromises);
    // await seederService.confirmSeederObject("roles");
  } catch (error) {
    console.error("Error seeding roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}
