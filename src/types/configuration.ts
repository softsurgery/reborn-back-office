import { ResponseUserDto } from "./user-management";

export interface ResponseConfigurationParamDto {
  id: number;
  name?: string;
  description?: string;
  namespace: ResponseConfigurationNamespaceDto;
  namespaceId: string;
  variant: ParamVariant;
  value?: string;
  options?: { label: string; value: string }[];
}

export interface ResponseConfigurationNamespaceDto {
  id: string;
  name?: string;
  description?: string;
  params?: ResponseConfigurationParamDto[];
  userId?: string;
  user: ResponseUserDto;
}

export interface UpdateConfigurationParameterDto {
  id: number;
  value: string;
}

export enum ParamVariant {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  SELECT = "select",
}
