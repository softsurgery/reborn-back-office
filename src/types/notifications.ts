import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export enum NotificationType {
  TEST = "TEST",
  NEW_SIGIN = "NEW_SIGIN",
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_JOB_REQUEST = "NEW_JOB_REQUEST",
}

export interface ResponseNotificationDto extends DatabaseEntity {
  id: string;
  type: NotificationType;
  userId?: string;
  user: ResponseUserDto;
  payload?: any;
}
