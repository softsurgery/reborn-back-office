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

  async getPermissionById(id: number): Promise<Permission | null> {
    return this.permissionRepository.findById(id);
  }

  async createPermission(data: Partial<Permission>): Promise<Permission> {
    return this.permissionRepository.create(data);
  }

  async updatePermission(
    id: number,
    data: Partial<Permission>
  ): Promise<Permission> {
    return this.permissionRepository.update(id, data);
  }

  async deletePermission(id: number): Promise<Permission> {
    return this.permissionRepository.softDelete(id);
  }

  async countPermissions(where: any = {}): Promise<number> {
    return this.permissionRepository.count(where);
  }
}
