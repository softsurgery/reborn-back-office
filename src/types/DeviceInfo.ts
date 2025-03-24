import { Feedback } from "./Feedback";
import { DatabaseEntity } from "./utilities/database-entity";

export interface DeviceInfo extends DatabaseEntity {
  id: string;
  platform?: string;
  model?: string;
  version?: string;
  manufacturer?: string;
  feedbacks: Feedback[];
}
