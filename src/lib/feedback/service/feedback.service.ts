import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Feedback } from "@/types/feedback";
import { FeedbackRepository } from "../repositories/feedback.repository";
import { DeviceInfoService } from "@/lib/device-info/services/device-info.service";

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
    // const deviceInfo = await this.deviceInfoService.getDeviceInfo
    return this.feedbackRepository.create(data);
  }

  async updateFeedback(id: string, data: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackRepository.update(id, data);
  }

  async deleteFeedback(id: string): Promise<Feedback> {
    return this.feedbackRepository.delete(id);
  }

  async countFeedbacks(where: any = {}): Promise<number> {
    return this.feedbackRepository.count(where);
  }
}
