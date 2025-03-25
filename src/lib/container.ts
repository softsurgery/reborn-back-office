import { PrismaClient } from "@prisma/client";
import { RoleService } from "./users-management/services/role.service";
import { RoleRepository } from "./users-management/repositories/role.repository";
import { PermissionService } from "./users-management/services/permission.service";
import { PermissionRepository } from "./users-management/repositories/permission.repository";
import { RolePermissionRepository } from "./users-management/repositories/role-permission.repository";
import { UserService } from "./users-management/services/user.service";
import { UserRepository } from "./users-management/repositories/user.repository";
import { UploadService } from "./upload/services/upload.service";
import { UploadRepository } from "./upload/repositories/upload.repository";
import { FeedbackService } from "./feedback/service/feedback.service";
import { FeedbackRepository } from "./feedback/repositories/feedback.repository";
import { DeviceInfoService } from "./device-info/services/device-info.service";
import { DeviceInfoRepository } from "./device-info/repositories/device-info.repository";

const prisma = new PrismaClient();

//file-managmement
const uploadService = new UploadService(new UploadRepository(prisma)); //upload

//user-management
const userService = new UserService(new UserRepository(prisma)); //user
const roleService = new RoleService(
  new RoleRepository(prisma),
  new RolePermissionRepository(prisma)
); //role
const permissionService = new PermissionService(
  new PermissionRepository(prisma)
);

//feedback/bug-report
const deviceInfoService = new DeviceInfoService(
  new DeviceInfoRepository(prisma)
); // device-info
const feedbackService = new FeedbackService(
  new FeedbackRepository(prisma),
  deviceInfoService
); // feedback

const container = {
  UploadService: uploadService,
  UserService: userService,
  RoleService: roleService,
  PermissionService: permissionService,
  FeedbackService: feedbackService,
};

export default container;
