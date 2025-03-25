import { DatabaseEntity } from "./utilities/database-entity";

export interface Feedback extends DatabaseEntity {
  id: string;
  message: string | null;
  rating: number | null;
  category: string | null;
  deviceId: string | null;
  device?: DeviceInfo | null;
}

export interface DeviceInfo extends DatabaseEntity {
  id: string;
  platform: string | null;
  model: string | null;
  version: string | null;
  manufacturer: string | null;
  feedbacks?: Feedback[];
}

