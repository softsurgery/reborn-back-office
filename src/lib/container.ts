import { RoleService } from "./users-management/services/role.service";
import { RoleRepository } from "./users-management/repositories/role.repository";
import { PermissionService } from "./users-management/services/permission.service";
import { PermissionRepository } from "./users-management/repositories/permission.repository";
import { RolePermissionRepository } from "./users-management/repositories/role-permission.repository";
import { UserService } from "./users-management/services/user.service";
import { UserRepository } from "./users-management/repositories/user.repository";
import { FeedbackService } from "./feedback/service/feedback.service";
import { FeedbackRepository } from "./feedback/repositories/feedback.repository";
import { DeviceInfoService } from "./device-info/services/device-info.service";
import { DeviceInfoRepository } from "./device-info/repositories/device-info.repository";
import { BugService } from "./bug/service/bug.service";
import { BugRepository } from "./bug/repositories/bug.repository";
import { RegionService } from "./content/services/region.service";
import { RegionRepository } from "./content/repositories/region.repository";
import { AuthService } from "./auth";
import prisma from "@/lib/prisma";
import { CardinalApiKeyService } from "./cardinal/api-key.service";

//cardinal
const cardinalApiKeyService = new CardinalApiKeyService();
//user-management
const userService = new UserService(
  new UserRepository(prisma),
  cardinalApiKeyService
); //user
const authService = new AuthService(userService); //auth
const roleService = new RoleService(
  new RoleRepository(prisma),
  new RolePermissionRepository(prisma)
); //role
const permissionService = new PermissionService(
  new PermissionRepository(prisma)
); //permission

//feedback/bug-report
const deviceInfoService = new DeviceInfoService(
  new DeviceInfoRepository(prisma)
); // device-info
const feedbackService = new FeedbackService(
  new FeedbackRepository(prisma),
  deviceInfoService
); // feedback
const bugService = new BugService(new BugRepository(prisma), deviceInfoService); // bug

//content
const regionService = new RegionService(new RegionRepository(prisma));

const container = {
  //cardinal
  CardinalApiKeyService: cardinalApiKeyService,
  //user-management
  AuthService: authService,
  UserService: userService,
  RoleService: roleService,
  PermissionService: permissionService,
  //reporting
  FeedbackService: feedbackService,
  BugService: bugService,
  DeviceInfoService: deviceInfoService,
  //content
  RegionService: regionService,
};

export default container;
