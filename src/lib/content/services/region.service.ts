import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { RegionRepository } from "../repositories/region.repository";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Region } from "@/types";

export class RegionService {
  private regionRepository: RegionRepository;

  constructor(regionRepository: RegionRepository) {
    this.regionRepository = regionRepository;
  }
  async getPaginatedRegions(
    queryObject: IQueryObject
  ): Promise<Paginated<Region>> {
    return this.regionRepository.findPaginated(queryObject);
  }

  async getAllRegions(queryObject: IQueryObject): Promise<Region[]> {
    return this.regionRepository.findByCondition(queryObject);
  }

  async getRegionById(id: number): Promise<Region | null> {
    return this.regionRepository.findById(id);
  }

  async createRegion(data: Partial<Region>): Promise<Region> {
    return this.regionRepository.create(data);
  }

  async updateRegion(id: number, data: Partial<Region>): Promise<Region> {
    return this.regionRepository.update(id, data);
  }

  async deleteRegion(id: number): Promise<Region> {
    return this.regionRepository.softDelete(id);
  }

  async countRegions(where: any = {}): Promise<number> {
    return this.regionRepository.count(where);
  }
}
