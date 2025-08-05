import { Paginated, QueryParams, ResponseLogDto } from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "user",
}: QueryParams): Promise<Paginated<ResponseLogDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseLogDto>>(
    `/admin/logger/list`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseLogDto[]> => {
  const response = await axios.get<ResponseLogDto[]>(`/admin/logger/all`);
  return response.data;
};

const findById = async (id: string | number): Promise<ResponseLogDto> => {
  const response = await axios.get<ResponseLogDto>(`/admin/logger/${id}`);
  return response.data;
};

export const logger = {
  findPaginated,
  findAll,
  findById,
};
