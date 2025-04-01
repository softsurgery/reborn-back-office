import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { BugRepository } from "../repositories/bug.repository";
import { DeviceInfoService } from "@/lib/device-info/services/device-info.service";
import { Bug, DeviceInfo } from "@/types";

export class BugService {
  private bugRepository: BugRepository;
  private deviceInfoService: DeviceInfoService;

  constructor(
    bugRepository: BugRepository,
    deviceInfoService: DeviceInfoService
  ) {
    this.bugRepository = bugRepository;
    this.deviceInfoService = deviceInfoService;
  }
  async getPaginatedBugs(queryObject: IQueryObject): Promise<Paginated<Bug>> {
    return this.bugRepository.findPaginated(queryObject);
  }

  async getAllBugs(queryObject: IQueryObject): Promise<Bug[]> {
    return this.bugRepository.findByCondition(queryObject);
  }

  async getBugById(id: string): Promise<Bug | null> {
    return this.bugRepository.findById(id);
  }

  async createBug(data: Partial<Bug>): Promise<Bug> {
    const { device, ...rest } = data;
    let deviceInfo: DeviceInfo | null = null;
    if (device) {
      deviceInfo = await this.deviceInfoService.getDeviceInfoByCondition({
        filter: `model||$eq||${device.model}`,
      });

      if (!deviceInfo) {
        deviceInfo = await this.deviceInfoService.createDeviceInfo(device);
      }

      rest.deviceId = deviceInfo.id;
    }
    return this.bugRepository.create(rest);
  }

  async updateBug(id: string, data: Partial<Bug>): Promise<Bug> {
    return this.bugRepository.update(id, data);
  }

  async deleteBug(id: number): Promise<Bug> {
    return this.bugRepository.delete(id);
  }

  async countBugs(where: any = {}): Promise<number> {
    return this.bugRepository.count(where);
  }
}
