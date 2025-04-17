import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Region } from "@/types";
import { PrismaClient } from "@prisma/client";

export class RegionRepository extends BaseRepository<Region> {
  constructor(prisma: PrismaClient) {
    super(prisma.region, prisma);
  }
}