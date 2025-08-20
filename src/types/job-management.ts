import { ResponseCurrencyDto } from "./content";
import { Upload } from "./upload";
import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseUserDto;
  currency: ResponseCurrencyDto;
  currencyId: string;
  jobTags: ResponseJobTagDto[];
  uploads: ResponseJobUploadDto[];
}

export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  jobTagIds: number[];
  currencyId?: string;
  uploads?: { uploadId: number }[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseJobTagDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateJobTagDto {
  label: string;
}

export interface UpdateJobTagDto extends Partial<CreateJobTagDto> {}

export interface ResponseJobUploadDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job: ResponseJobDto;
  uploadId: number;
  upload: Upload;
  order: number;
}
