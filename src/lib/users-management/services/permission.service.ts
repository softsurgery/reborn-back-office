import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { PermissionRepository } from "../repositories/permission.repository";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Permission } from "@/types/user-management";

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }
  async getPaginatedPermissions(
    queryObject: IQueryObject
  ): Promise<Paginated<Permission>> {
    return this.permissionRepository.findPaginated(queryObject);
  }

  async getAllPermissions(queryObject: IQueryObject): Promise<Permission[]> {
    return this.permissionRepository.findByCondition(queryObject);
  }

  async getPermissionById(id: string): Promise<Permission | null> {
    return this.permissionRepository.findById(id);
  }

  async createPermission(data: Partial<Permission>): Promise<Permission> {
    return this.permissionRepository.create(data);
  }

  async createManyPermissions(data: Partial<Permission>[]): Promise<Permission[]> {
    return this.permissionRepository.createMany(data);
  }

  async updatePermission(
    id: string,
    data: Partial<Permission>
  ): Promise<Permission> {
    return this.permissionRepository.update(id, data);
  }

  async deletePermission(id: string): Promise<Permission> {
    return this.permissionRepository.softDelete(id);
  }

  async countPermissions(where: any = {}): Promise<number> {
    return this.permissionRepository.count(where);
  }
}
