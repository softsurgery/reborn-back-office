import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { DeviceInfo } from "@/types";
import { PrismaClient } from "@prisma/client";

export class DeviceInfoRepository extends BaseRepository<DeviceInfo> {
  constructor(prisma: PrismaClient) {
    super(prisma.deviceInfo, prisma);
  }
}
