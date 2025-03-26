import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { DeviceInfoRepository } from "../repositories/device-info.repository";
import { DeviceInfo } from "@/types";

export class DeviceInfoService {
  private deviceInfoRepository: DeviceInfoRepository;

  constructor(deviceInfoRepository: DeviceInfoRepository) {
    this.deviceInfoRepository = deviceInfoRepository;
  }
  async getPaginatedDeviceInfos(
    queryObject: IQueryObject
  ): Promise<Paginated<DeviceInfo>> {
    return this.deviceInfoRepository.findPaginated(queryObject);
  }

  async getAllDeviceInfos(queryObject: IQueryObject): Promise<DeviceInfo[]> {
    return this.deviceInfoRepository.findByCondition(queryObject);
  }

  async getDeviceInfoById(id: string): Promise<DeviceInfo | null> {
    return this.deviceInfoRepository.findById(id);
  }

  async getDeviceInfoByCondition(queryObject: IQueryObject): Promise<DeviceInfo | null> {
    return this.deviceInfoRepository.findOneByCondition(queryObject);
  }


  async createDeviceInfo(data: Partial<DeviceInfo>): Promise<DeviceInfo> {
    return this.deviceInfoRepository.create(data);
  }

  async updateDeviceInfo(
    id: string,
    data: Partial<DeviceInfo>
  ): Promise<DeviceInfo> {
    return this.deviceInfoRepository.update(id, data);
  }

  async deleteDeviceInfo(id: string): Promise<DeviceInfo> {
    return this.deviceInfoRepository.delete(id);
  }

  async countDeviceInfos(where: any = {}): Promise<number> {
    return this.deviceInfoRepository.count(where);
  }
}
