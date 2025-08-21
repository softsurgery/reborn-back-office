import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseDeviceInfoDto extends DatabaseEntity {
  id: number;
  model?: string;
  platform?: string;
  version?: string;
  manufacturer?: string;
}

export enum BugVariant {
  CRASH = "Crash",
  UI_ISSUE = "UI Issue",
  PERFORMANCE_ISSUE = "Performance Issue",
  FEATURE_NOT_WORKING = "Feature Not Working",
  OTHER = "Other",
}

export interface ResponseBugDto extends DatabaseEntity {
  id: number;
  title: string;
  description: string;
  variant: BugVariant;
  deviceId: number;
  device?: ResponseDeviceInfoDto;
  user: ResponseUserDto;
  userId: number;
}

export enum FeedbackCategory {
  GENERAL_FEEDBACK = "General Feedback",
  FEATURE_REQUEST = "Feature Request",
  OTHER = "Other",
}

export interface ResponseFeedbackDto extends DatabaseEntity {
  id: number;
  category: FeedbackCategory;
  message: string;
  rating?: number;
  device: ResponseDeviceInfoDto;
  deviceId: number;
  user: ResponseUserDto;
  userId: number;
}
