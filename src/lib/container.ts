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
import { AuthService } from "./auth/auth";
import { MobileUserService } from "./users-management/services/mobile-user.service";
import { MobileUserRepository } from "./users-management/repositories/mobile-user.repository";
import { UploadRepository } from "./storage/repositories/upload.repository";
import { StorageService } from "./storage/services/upload.service";
import prisma from "@/lib/prisma";
import { ResetTokenService } from "./users-management/services/reset-token.service";
import { ResetTokenRepository } from "./users-management/repositories/rest-token.reporitory";
import { MailService } from "./mail/services/mail.service";
import { TemplateService } from "./mail/services/template.service";
import { TemplateRepository } from "./mail/repositories/template.repository";

const templateService = new TemplateService(new TemplateRepository(prisma));

const mailService = new MailService(templateService);

//user-management
const mobileUserService = new MobileUserService(
  new MobileUserRepository(prisma)
); //appuser
const userService = new UserService(new UserRepository(prisma)); //user
const resetTokenService = new ResetTokenService(
  new ResetTokenRepository(prisma)
); //reset-token
const authService = new AuthService(
  userService,
  resetTokenService,
  mailService
); //auth
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

//upload
const storageService = new StorageService(new UploadRepository(prisma));

const container = {
  StorageService: storageService,
  //user-management
  AuthService: authService,
  MobileUserService: mobileUserService,
  UserService: userService,
  RoleService: roleService,
  PermissionService: permissionService,
  ResetTokenService: resetTokenService,
  //reporting
  FeedbackService: feedbackService,
  BugService: bugService,
  DeviceInfoService: deviceInfoService,
  //content
  RegionService: regionService,
  MailService: mailService,
};

export default container;
