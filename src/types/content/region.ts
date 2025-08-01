import { DatabaseEntity } from "../utils/database-entity";

export interface Region extends DatabaseEntity {
  id: number;
  label: string;
}
