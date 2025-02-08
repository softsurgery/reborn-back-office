import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Permission } from "@/types/user-management";
import { PrismaClient } from "@prisma/client";

export class PermissionRepository extends BaseRepository<Permission> {
  constructor(prisma: PrismaClient) {
    super(prisma.permission, prisma);
  }
}