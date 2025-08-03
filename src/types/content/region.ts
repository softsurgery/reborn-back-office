import { DatabaseEntity } from "../utils/database-entity";

export interface ResponseRegionDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateRegionDto {
  label: string;
}

export interface UpdateRegionDto extends CreateRegionDto {}
