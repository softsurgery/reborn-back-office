import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Upload } from "@/types/upload";
import { PrismaClient } from "@prisma/client";

export class UploadRepository extends BaseRepository<Upload> {
  constructor(prisma: PrismaClient) {
    super(prisma.upload, prisma);
  }
}