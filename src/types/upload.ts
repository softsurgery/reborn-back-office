import { User } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface Upload extends DatabaseEntity {
  id: number;
  slug: string;
  filename: string;
  relativePath: string;
  mimetype: string;
  size: number;
  userId: string | null;
  user?: User | null;
}
