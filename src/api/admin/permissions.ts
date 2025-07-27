import { Paginated, QueryParams, ResponsePermissionDto } from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponsePermissionDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponsePermissionDto>>(
    `/admin/permission/list`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponsePermissionDto[]> => {
  const response = await axios.get<ResponsePermissionDto[]>(
    `/admin/permission/all`
  );
  return response.data;
};

const findById = async (id: string): Promise<ResponsePermissionDto> => {
  const response = await axios.get<ResponsePermissionDto>(
    `/admin/permission/${id}`
  );
  return response.data;
};

const remove = async (id: string): Promise<void> => {
  await axios.delete(`/api/permissions/${id}`);
};

export const permission = {
  findPaginated,
  findAll,
  findById,
  remove,
};
