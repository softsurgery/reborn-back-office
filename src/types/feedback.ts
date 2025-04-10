import { DeviceInfo } from "./device-info";
import { DatabaseEntity } from "./utils/database-entity";

export type FeedbackCategory = "FeatureRequest" | "GeneralFeedback" | "Other";

export interface Feedback extends DatabaseEntity {
  id: number;
  message: string;
  rating: number;
  category: FeedbackCategory;
  deviceId: number | null;
  device?: DeviceInfo | null;
}
