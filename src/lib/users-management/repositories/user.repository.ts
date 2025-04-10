import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { User } from "@/types/user-management";

export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaClient) {
    super(prisma.user, prisma);
  }
}