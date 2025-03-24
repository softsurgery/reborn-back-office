import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Feedback } from "@/types/Feedback";
import { PrismaClient } from "@prisma/client";

export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor(prisma: PrismaClient) {
    super(prisma.feedback, prisma);
  }
}
