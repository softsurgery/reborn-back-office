import { Feedback } from "./feedback";
import { DatabaseEntity } from "./utilities/database-entity";

export interface DeviceInfo extends DatabaseEntity {
    id: string;
    platform: string | null;
    model: string | null;
    version: string | null;
    manufacturer: string | null;
    feedbacks?: Feedback[];
  }
  