import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { ResetToken } from "@/prisma/interfaces";

export class ResetTokenRepository extends BaseRepository<ResetToken> {
  constructor(prisma: PrismaClient) {
    super(prisma.resetToken, prisma);
  }
}