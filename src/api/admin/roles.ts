import {
  CreateRoleDto,
  Paginated,
  QueryParams,
  ResponseRoleDto,
  UpdateRoleDto,
} from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "permissions.permission",
}: QueryParams): Promise<Paginated<ResponseRoleDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseRoleDto>>(
    `/admin/role/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseRoleDto[]> => {
  const response = await axios.get<ResponseRoleDto[]>(`/admin/role/all`);
  return response.data;
};

const findById = async (id: string): Promise<ResponseRoleDto> => {
  const response = await axios.get<ResponseRoleDto>(`/admin/role/${id}`);
  return response.data;
};

const create = async (role: CreateRoleDto): Promise<ResponseRoleDto> => {
  const response = await axios.post("/admin/role", role);
  return response.data;
};

const update = async (
  id?: string,
  role?: UpdateRoleDto
): Promise<ResponseRoleDto> => {
  const response = await axios.put(`/admin/role/${id}`, role);
  return response.data;
};

//have to be implemented
const duplicate = async (id?: string): Promise<ResponseRoleDto> => {
  const response = await axios.post(`/admin/role/duplicate/${id}`);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseRoleDto> => {
  const response = await axios.delete(`/admin/role/${id}`);
  return response.data;
};

export const role = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  duplicate,
  remove,
};
