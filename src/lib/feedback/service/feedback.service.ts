import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Feedback } from "@/types/Feedback";
import { FeedbackRepository } from "../repositories/feedback.repository";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }
  async getPaginatedFeedbacks(
    queryObject: IQueryObject
  ): Promise<Paginated<Feedback>> {
    return this.feedbackRepository.findPaginated(queryObject);
  }

  async getAllFeedbacks(queryObject: IQueryObject): Promise<Feedback[]> {
    return this.feedbackRepository.findByCondition(queryObject);
  }

  async getFeedbackById(id: number): Promise<Feedback | null> {
    return this.feedbackRepository.findById(id);
  }

  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackRepository.create(data);
  }

  async updateFeedback(id: number, data: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackRepository.update(id, data);
  }

  async deleteFeedback(id: number): Promise<Feedback> {
    return this.feedbackRepository.delete(id);
  }

  async countFeedbacks(where: any = {}): Promise<number> {
    return this.feedbackRepository.count(where);
  }
}
