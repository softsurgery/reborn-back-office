import { AxiosError } from "axios";

export interface ServerResponse<T = undefined> {
  message: string;
  code: number;
  data: T;
}

interface ServerError {
  message: string;
  code: number;
}

export interface ServerErrorResponse extends AxiosError<ServerError> {}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface QueryParams {
  select?: string;
  join?: string;
  sort?: string;
  cache?: string;
  limit?: string;
  page?: string;
  filter?: string;
  search?: string;
}
