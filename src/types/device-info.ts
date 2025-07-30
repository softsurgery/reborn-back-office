import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseDeviceInfoDto extends DatabaseEntity {
  id: number;
  model?: string;
  platform?: string;
  version?: string;
  manufacturer?: string;
}

export interface CreateDeviceInfoDto {
  model?: string;
  platform?: string;
  version?: string;
  manufacturer?: string;
}
