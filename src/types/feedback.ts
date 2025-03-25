import { DeviceInfo } from "./device-info";
import { DatabaseEntity } from "./utilities/database-entity";

export interface Feedback extends DatabaseEntity {
  id: string;
  message: string | null;
  rating: number | null;
  category: string | null;
  deviceId: string | null;
  device?: DeviceInfo | null;
}


