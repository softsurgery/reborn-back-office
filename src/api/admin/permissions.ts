import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Permission,ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Permission>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Permission>>(
    `/api/admin/permissions/list?`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<Permission[]> => {
  const response = await axios.get<Permission[]>(`/api/admin/permissions`);
  return response.data;
};

const findById = async (permissionId: string): Promise<Permission> => {
  const response = await axios.get<Permission>(
    `/api/permissions/${permissionId}`
  );
  return response.data;
};

const create = async (Permission: Partial<Permission>): Promise<Permission> => {
  const response = await axios.post<Permission>("/api/admin/permissions", Permission);
  return response.data;
};

const update = async (
  permissionId: string,
  Permission: Partial<Permission>
): Promise<Permission> => {
  const response = await axios.put<Permission>(
    `/api/permissions/${permissionId}`,
    Permission
  );
  return response.data;
};

const remove = async (permissionId: string): Promise<void> => {
  await axios.delete(`/api/admin/permissions/${permissionId}`);
};

const seed = async (): Promise<ServerResponse> => {
  const response = await axios.get("/api/admin/permissions/seed");
  return response.data;
};

export const permission = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
  seed,
};
