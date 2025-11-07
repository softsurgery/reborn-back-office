import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseRefTypeDto extends DatabaseEntity {
  id: number;
  label: string;
  description: string;
  refParams: ResponseRefParamDto[];
}

export interface CreateRefTypeDto {
  label: string;
  description: string;
}

export interface UpdateRefTypeDto extends Partial<CreateRefTypeDto> {}

export interface ResponseRefParamDto extends DatabaseEntity {
  id: number;
  label: string;
  description: string;
  refTypeId: number;
  refType: ResponseRefTypeDto;
  extras: object;
}

export interface CreateRefParamDto {
  label: string;
  description: string;
  refTypeId?: number;
  extras: object;
}


export interface UpdateRefParamDto extends Partial<CreateRefParamDto> {}
