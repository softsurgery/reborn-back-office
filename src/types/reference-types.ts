import { DatabaseEntity } from "./utils";

export interface ResponseRefTypeDto extends DatabaseEntity {
  id: number;
  label: string;
  description: string;
  refParams: ResponseRefParamDto[];
  parentId?: number;
  parent?: ResponseRefTypeDto;
  children: ResponseRefTypeDto[];
}

export interface CreateRefTypeDto {
  label: string;
  description: string;
  parentId?: number;
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
