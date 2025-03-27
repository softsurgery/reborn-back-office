import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { FeedbackRepository } from "../repositories/feedback.repository";
import { DeviceInfoService } from "@/lib/device-info/services/device-info.service";
import { Feedback, DeviceInfo } from "@/types";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;
  private deviceInfoService: DeviceInfoService;

  constructor(
    feedbackRepository: FeedbackRepository,
    deviceInfoService: DeviceInfoService
  ) {
    this.feedbackRepository = feedbackRepository;
    this.deviceInfoService = deviceInfoService;
  }
  async getPaginatedFeedbacks(
    queryObject: IQueryObject
  ): Promise<Paginated<Feedback>> {
    return this.feedbackRepository.findPaginated(queryObject);
  }

  async getAllFeedbacks(queryObject: IQueryObject): Promise<Feedback[]> {
    return this.feedbackRepository.findByCondition(queryObject);
  }

  async getFeedbackById(id: string): Promise<Feedback | null> {
    return this.feedbackRepository.findById(id);
  }

  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
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
    return this.feedbackRepository.create(rest);
  }

  async updateFeedback(id: string, data: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackRepository.update(id, data);
  }

  async deleteFeedback(id: number): Promise<Feedback> {
    return this.feedbackRepository.delete(id);
  }

  async countFeedbacks(where: any = {}): Promise<number> {
    return this.feedbackRepository.count(where);
  }
}
