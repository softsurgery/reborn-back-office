import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { RolePermission } from "@/types/user-management";

export class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor(prisma: PrismaClient) {
    super(prisma.rolePermission, prisma);
  }
}