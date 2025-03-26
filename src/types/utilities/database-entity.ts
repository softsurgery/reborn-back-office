export interface DatabaseEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeletionRestricted: boolean;
}
