import { Feedback } from "./feedback";
import { DatabaseEntity } from "./utils/database-entity";

export interface DeviceInfo extends DatabaseEntity {
  id: number;
  platform: string | null;
  model: string;
  version: string | null;
  manufacturer: string | null;
  feedbacks?: Feedback[];
}
