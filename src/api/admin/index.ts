import { permission } from "./permissions";
import { role } from "./roles";
import { user } from "./users";
import { refParam } from "./ref-param";
import { refType } from "./ref-type";
import { deviceInfo } from "./deviceInfos";
import { upload } from "./upload";
import { logger } from "./logger";

export const admin = {
  upload,
  permission,
  refParam,
  refType,
  role,
  user,
  deviceInfo,
  logger,
};
