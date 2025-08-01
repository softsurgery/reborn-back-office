import { CreateDeviceInfoDto, ResponseDeviceInfoDto } from "./device-info";
import { DatabaseEntity } from "./utils/database-entity";

export type FeedbackCategory = "FeatureRequest" | "GeneralFeedback" | "Other" | "unknown";

export interface ResponseFeedbackDto extends DatabaseEntity {
  id: number;
  category: FeedbackCategory;
  message: string;
  rating?: number;
  device: ResponseDeviceInfoDto;
  deviceId: number;
}

