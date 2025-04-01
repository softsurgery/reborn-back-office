import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Bug } from "@/types";
import { PrismaClient } from "@prisma/client";

export class BugRepository extends BaseRepository<Bug> {
  constructor(prisma: PrismaClient) {
    super(prisma.bug, prisma);
  }
}
