import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Template } from "@/prisma/interfaces";
import { PrismaClient } from "@prisma/client";

export class TemplateRepository extends BaseRepository<Template> {
  constructor(prisma: PrismaClient) {
    super(prisma.template, prisma);
  }
}