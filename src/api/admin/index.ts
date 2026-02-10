import { permission } from "./permissions";
import { role } from "./roles";
import { user } from "./users";
import { experience } from "./experience";
import { education } from "./education";
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
  experience,
  education,
  deviceInfo,
  logger,
};
