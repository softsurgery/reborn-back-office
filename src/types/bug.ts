import { DeviceInfo } from "./device-info";
import { DatabaseEntity } from "./utilities/database-entity";

export type BugCategory = "Crash" | "UiIssue" | "Performance" | "FeatureNotWorking" | "Other";

export interface Bug extends DatabaseEntity{
  id: number;
  title: string;
  description: string;
  category: BugCategory;
  deviceId: number | null;
  device?: DeviceInfo | null;
}
