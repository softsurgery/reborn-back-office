import { PrismaClient } from "@prisma/client";
import { RoleService } from "./users-management/services/role.service";
import { RoleRepository } from "./users-management/repositories/role.repository";
import { PermissionService } from "./users-management/services/permission.service";
import { PermissionRepository } from "./users-management/repositories/permission.repository";
import { RolePermissionRepository } from "./users-management/repositories/role-permission.repository";
import { UserService } from "./users-management/services/user.service";
import { UserRepository } from "./users-management/repositories/user.repository";

const prisma = new PrismaClient();

const container = {
  UserService: new UserService(new UserRepository(prisma)),
  RoleService: new RoleService(
    new RoleRepository(prisma),
    new RolePermissionRepository(prisma)
  ),
  PermissionService: new PermissionService(new PermissionRepository(prisma)),
};

export default container;
