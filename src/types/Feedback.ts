import { DeviceInfo } from "./DeviceInfo";
import { DatabaseEntity } from "./utilities/database-entity";

export interface Feedback extends DatabaseEntity {
  id: string;
  message?: string;
  rating?: number;
  category?: string;
  deviceId?: string | null;
  device?: DeviceInfo | null;
}
