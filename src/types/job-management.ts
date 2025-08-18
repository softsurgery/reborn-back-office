import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseUserDto;
}

export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
