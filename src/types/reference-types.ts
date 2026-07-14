import { DatabaseEntity } from "./utils";

export interface ResponseRefTypeDto extends DatabaseEntity {
  id: string;
  label: string;
  description: string;
  refParams: ResponseRefParamDto[];
  parentId?: string;
  parent?: ResponseRefTypeDto;
  children: ResponseRefTypeDto[];
}

export interface CreateRefTypeDto {
  label: string;
  description: string;
  parentId?: string;
}

export interface UpdateRefTypeDto extends Partial<CreateRefTypeDto> {}

export interface ResponseRefParamDto extends DatabaseEntity {
  id: number;
  label: string;
  description: string;
  refTypeId: string;
  refType: ResponseRefTypeDto;
  extras: any;
}

export interface CreateRefParamDto {
  label: string;
  description: string;
  refTypeId?: string;
  extras: any;
}

export interface UpdateRefParamDto extends Partial<CreateRefParamDto> {}
