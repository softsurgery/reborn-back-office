import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Role } from "@/types/user-management";

export class RoleRepository extends BaseRepository<Role> {
  constructor(prisma: PrismaClient) {
    super(prisma.role, prisma);
  }
}