export interface Upload {
  id: number;
  slug: string;
  filename: string;
  relativePath: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
