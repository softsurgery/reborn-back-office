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
  tags: ResponseJobTagDto[];
  categoryId: number;
  category: ResponseJobCategoryDto;
  style: JobStyle;
  difficulty: JobDifficulty;
  uploads: ResponseJobUploadDto[];
}

export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  tagIds: number[];
  currencyId?: string;
  categoryId?: number;
  style?: JobStyle;
  difficulty?: JobDifficulty;
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

export interface ResponseJobCategoryDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateJobCategoryDto {
  label: string;
}

export interface UpdateJobCategoryDto extends Partial<CreateJobCategoryDto> {}

export interface ResponseJobUploadDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job: ResponseJobDto;
  uploadId: number;
  upload: Upload;
  order: number;
}

export enum JobStyle {
  REMOTE = "Remote",
  ONSITE = "On-site",
  FLEXIBLE = "Flexible Hours",
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  FREELANCE = "Freelance",
  WEEKEND = "Weekend Job",
  NIGHT = "Night Shift",
  DAY = "Day Shift",
}

export enum JobDifficulty {
  ENTRY_LEVEL = "Entry Level",
  MID_LEVEL = "Mid Level",
  SENIOR_LEVEL = "Senior Level",
  INTERN = "Internship",
}


