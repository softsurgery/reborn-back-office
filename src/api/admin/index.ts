import { permission } from "./permissions";
import { role } from "./roles";
import { user } from "./users";
import { deviceInfo } from "./deviceInfos";
import { content } from "./content";
import { mobileUser } from "./mobile-user";
import { upload } from "./upload";

export const admin = {
  content,
  upload,
  permission,
  role,
  user,
  deviceInfo,
  mobileUser,
};
