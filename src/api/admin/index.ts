import { permission } from "./permissions";
import { role } from "./roles";
import { user } from "./users";
import { deviceInfo } from "./deviceInfos";
import { upload } from "./upload";
import { logger } from "./logger";

export const admin = {
  upload,
  permission,
  role,
  user,
  deviceInfo,
  logger,
};
