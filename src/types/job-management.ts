import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseUserDto;
  currency: ResponseRefParamDto;
  currencyId: string;
  tags: ResponseJobTagDto[];
  categoryId: number;
  category: ResponseRefParamDto;
  style: JobStyle;
  difficulty: JobDifficulty;
  uploads: ResponseJobUploadDto[];
}

export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  tagIds: number[];
  currencyId?: number;
  categoryId?: number;
  style?: JobStyle;
  difficulty?: JobDifficulty;
  uploads?: { uploadId: number }[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  uploads?: { id: number; uploadId: number }[];
}

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
