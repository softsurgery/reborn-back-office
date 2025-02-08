import { PrismaClient } from "@prisma/client";
import { permissions } from "./data/permission.data";

export async function seedPermissions() {
    const prisma = new PrismaClient();

    try {
        const upsertPromises = permissions.map(permission =>
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
    } catch (error) {
        console.error("Error seeding permissions:", error);
    } finally {
        await prisma.$disconnect();
    }
}