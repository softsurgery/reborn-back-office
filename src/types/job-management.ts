import { ResponseCurrencyDto } from "./content";
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
}

export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  jobTagIds: number[];
  currencyId?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface ResponseJobTagDto extends DatabaseEntity {
  id: number;
  label: string;
}
