import { DatabaseEntity } from "./utils/database-entity";

export interface PrivilegedFile {
  file: File;
  isPublic: boolean;
}

export interface Upload extends DatabaseEntity {
  id: number;
  slug: string;
  filename: string;
  relativePath: string;
  mimetype: string;
  size: number;
  folderId?: number;
  isTemporary?: boolean;
  isPrivate?: boolean;
}
