import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  status: JobStatus;
  title: string;
  description: string;
  price: number;
  pricingType: JobPricingType;
  postedBy: ResponseUserDto;
  currency: ResponseRefParamDto;
  currencyId: number;
  tags: ResponseRefParamDto[];
  categoryId: number;
  category: ResponseRefParamDto;
  style: JobStyle;
  difficulty: JobDifficulty;
  latitude?: number;
  longitude?: number;
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
  pricingType?: JobPricingType;
  status?: JobStatus;
  latitude?: number;
  longitude?: number;
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

export enum JobPricingType {
  FIXED = "fixed",
  HOURLY = "hourly",
}

export enum JobStatus {
  DRAFT = "Draft",
  POSTED = "Posted",
  CANDIDATE_PENDING = "Candidate Pending",
  NOT_STARTED = "Not Started",
  PENDING = "Pending",
  FINISHED = "Finished",
  ON_HOLD = "On Hold",
  REVIEWED_BY_WORKER = "Reviewed By Worker",
  REVIEWED_BY_WORKER_AND_CLIENT = "Reviewed By Worker & Client",
  FAILED = "Failed",
  SUCCESSFUL = "Successfull",
  ARCHIVED = "Archived",
  DELETED = "Deleted",
}

export enum JobEvents {
  POST = "Post",
  UNPUBLISH = "Unpublish",
  CHOOSE_CANDIDATE = "Choose Candidate",
  REFUSE_CANDIDATE = "Refuse Candidate",
  ACCEPT_CANDIDATE = "Accept Candidate",
  START = "Start",
  FINISH = "Finish",
  WORKER_REVIEW = "Worker Review",
  CLIENT_REVIEW = "Client Review",
  MARK_SUCCESSFUL = "Mark Successful",
  HOLD = "Hold",
  STOP_HOLD = "Stop Hold",
  MARK_FAILED = "Mark Failed",
  ARCHIVE = "Archive",
}

export interface ResponseJobWorkflowDto {
  status: JobStatus;
  isUpdatable: boolean;
  nextSteps: { label: string }[];
  job: ResponseJobDto;
}

export interface UpdateJobStatusDto {
  event: string;
}
