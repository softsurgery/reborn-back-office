import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { MobileUserRepository } from "../repositories/mobile-user.repository";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { MobileUser } from "@/types/user-management";

export class MobileUserService {
  private mobileUserRepository: MobileUserRepository;

  constructor(mobileUserRepository: MobileUserRepository) {
    this.mobileUserRepository = mobileUserRepository;
  }
  async getPaginatedMobileUser(
    queryObject: IQueryObject
  ): Promise<Paginated<MobileUser>> {
    return this.mobileUserRepository.findPaginated(queryObject);
  }

  async getAllMobileUser(queryObject: IQueryObject): Promise<MobileUser[]> {
    return this.mobileUserRepository.findByCondition(queryObject);
  }

  async getMobileUserById(id: string): Promise<MobileUser | null> {
    return this.mobileUserRepository.findById(id);
  }

  async createMobileUser(data: Partial<MobileUser>): Promise<MobileUser> {
    return this.mobileUserRepository.create(data);
  }

  async createManyMobileUser(data: Partial<MobileUser>[]): Promise<MobileUser[]> {
    return this.mobileUserRepository.createMany(data);
  }

  async updateMobileUser(id: string, data: Partial<MobileUser>): Promise<MobileUser> {
    return this.mobileUserRepository.update(id, data);
  }

  async deleteMobileUser(id: string): Promise<MobileUser> {
    return this.mobileUserRepository.softDelete(id);
  }

  async countMobileUser(where: any = {}): Promise<number> {
    return this.mobileUserRepository.count(where);
  }
}
