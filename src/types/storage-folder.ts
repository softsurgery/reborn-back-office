import { DatabaseEntity } from "./utils/database-entity";

export interface StorageFolder extends DatabaseEntity {
  id: number;
  name: string;
  systematicName?: string;
  parentId?: number;
  children?: StorageFolder[];
}

export interface StorageFolderContents {
  folders: StorageFolder[];
  files: import("./upload").Upload[];
}
