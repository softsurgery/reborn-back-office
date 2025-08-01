import { ResponseDeviceInfoDto } from "./device-info";
import { DatabaseEntity } from "./utils/database-entity";

export type BugCategory =
  | "Crash"
  | "UiIssue"
  | "Performance"
  | "FeatureNotWorking"
  | "Other";

export interface ResponseBugDto extends DatabaseEntity {
  id: number;
  title: string;
  description: string;
  category: BugCategory;
  deviceId: number;
  device?: ResponseDeviceInfoDto;
}

