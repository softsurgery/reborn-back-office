import { RoleRepository } from "../repositories/role.repository";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { RolePermissionRepository } from "../repositories/role-permission.repository";
import { Role, RolePermission } from "@/types/user-management";

export class RoleService {
  private roleRepository: RoleRepository;
  private rolePermissionRepository: RolePermissionRepository;

  constructor(
    roleRepository: RoleRepository,
    rolePermissionRepository: RolePermissionRepository
  ) {
    this.roleRepository = roleRepository;
    this.rolePermissionRepository = rolePermissionRepository;
  }

  async getPaginatedRoles(queryObject: IQueryObject): Promise<Paginated<Role>> {
    return this.roleRepository.findPaginated(queryObject);
  }

  async getAllRoles(queryObject: IQueryObject): Promise<Role[]> {
    return this.roleRepository.findByCondition(queryObject);
  }

  async getRoleById(id: number): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }

  async createRole(data: Partial<Role>, permissionIds: number[]): Promise<Role> {
    const role: Role = await this.roleRepository.create(data);
    await this.rolePermissionRepository.createMany(
      permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId: permissionId,
      }))
    );
    return role;
  }

  async updateRole(
    id: number,
    data: Partial<Role>,
    permissionIds: number[]
  ): Promise<Role> {
    await this.roleRepository.update(id, data);

    const updatedRole = (
      await this.roleRepository.findOneByCondition({
        filter: `id||$eq||${id}`,
        join: "permissions.permission",
      })
    )

    const existingPermissions = updatedRole?.permissions?.map((p: RolePermission) => {
      return {
        id: p.id,
        permissionId: p.permissionId,
        roleId: p.roleId,
      }
    });

    await this.roleRepository.updateAssociations<Partial<RolePermission>>({
      existingItems: existingPermissions || [],
      updatedItems: permissionIds.map((permissionId) => ({
        permissionId,
        roleId: updatedRole?.id,
      })),
      keys: ["permissionId", "roleId"],
      onDelete: async (id) => {
        return await this.rolePermissionRepository.delete(id);
      },
      onCreate: async (permission) => {
        return await this.rolePermissionRepository.create({
          permissionId: permission.permissionId,
          roleId: permission.roleId,
        });
      },
    });

    return updatedRole!;
  }

  async duplicateRole(roleId: number) {
    const role = await this.roleRepository.findOneByCondition({
      filter: `id||$eq||${roleId}`,
      join: "permissions.permission",
    });
    if (role) {
      const { id, createdAt, updatedAt, permissions, ...duplicatedData } = role
      return await this.createRole({ ...duplicatedData, label: `${duplicatedData.label} Duplicate` }, permissions?.map((p) => p.permissionId) || []);
    }
  }

  async deleteRole(id: number): Promise<Role> {
    return this.roleRepository.delete(id);
  }

  async countRoles(where: any = {}): Promise<number> {
    return this.roleRepository.count(where);
  }
}
