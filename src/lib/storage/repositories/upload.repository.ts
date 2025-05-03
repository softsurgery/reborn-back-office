import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Upload } from "@/prisma/interfaces";
import { PrismaClient } from "@prisma/client";

export class UploadRepository extends BaseRepository<Upload> {
  constructor(prisma: PrismaClient) {
    super(prisma.upload, prisma);
  }
}