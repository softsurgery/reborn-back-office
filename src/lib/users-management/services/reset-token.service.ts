import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { ResetToken } from "@/prisma/interfaces";
import { ResetTokenRepository } from "../repositories/rest-token.reporitory";
import { isBefore } from "date-fns";

export class ResetTokenService {
  private resetTokenRepository: ResetTokenRepository;

  constructor(resetTokenRepository: ResetTokenRepository) {
    this.resetTokenRepository = resetTokenRepository;
  }
  async getPaginatedResetTokens(
    queryObject: IQueryObject
  ): Promise<Paginated<ResetToken>> {
    return this.resetTokenRepository.findPaginated(queryObject);
  }

  async getAllResetTokens(queryObject: IQueryObject): Promise<ResetToken[]> {
    return this.resetTokenRepository.findByCondition(queryObject);
  }

  async getResetTokenById(id: string): Promise<ResetToken | null> {
    return this.resetTokenRepository.findById(id);
  }

  async createResetToken(data: Partial<ResetToken>): Promise<ResetToken> {
    return this.resetTokenRepository.create(data);
  }

  async createManyResetTokens(
    data: Partial<ResetToken>[]
  ): Promise<ResetToken[]> {
    return this.resetTokenRepository.createMany(data);
  }

  async getValidResetToken(token: string): Promise<ResetToken | null> {
    const resetToken = await this.resetTokenRepository.findOneByCondition({
      filter: `token||$eq||${token}`,
    });

    if (!resetToken || isBefore(resetToken.expires, new Date())) {
      return null;
    }

    return resetToken;
  }

  async invalidateResetToken(token: string): Promise<void> {
    const resetToken = await this.resetTokenRepository.findOneByCondition({
      filter: `token||$eq||${token}`,
    });

    if (resetToken) {
      await this.resetTokenRepository.softDelete(resetToken.id);
    }
  }

  async updateResetToken(
    id: string,
    data: Partial<ResetToken>
  ): Promise<ResetToken> {
    return this.resetTokenRepository.update(id, data);
  }

  async deleteResetToken(id: string): Promise<ResetToken> {
    return this.resetTokenRepository.softDelete(id);
  }

  async countResetTokens(where: any = {}): Promise<number> {
    return this.resetTokenRepository.count(where);
  }
}
