import { AppUser } from "../user-management";
import { DatabaseEntity } from "../utils/database-entity";

export interface Region extends DatabaseEntity {
  id: number;
  label: string;
  AppUser?: AppUser[];
}
