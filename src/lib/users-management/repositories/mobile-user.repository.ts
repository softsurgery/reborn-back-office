import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { MobileUser } from "@/types";
import { PrismaClient } from "@prisma/client";

export class MobileUserRepository extends BaseRepository<MobileUser> {
  constructor(prisma: PrismaClient) {
    super(prisma.mobileUser, prisma);
  }
}
