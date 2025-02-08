import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Permission } from "@/types/user-management";

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  sort: string,
  filter: string = "",
  fields: string[] = [],
  join: string[] = ["roles"]
): Promise<Paginated<Permission>> => {
  const response = await axios.get<Paginated<Permission>>(
    `/api/permissions/list?`,
    {
      params: {
        page,
        size,
        sort,
        filter,
        fields: fields? fields.join(",") : "",
        join: join? join.join(",") : "",
      },
    }
  );
  return response.data;
};

const findAll = async (): Promise<Permission[]> => {
  const response = await axios.get<Permission[]>(`/api/permissions`);
  return response.data;
};

const findById = async (permissionId: number): Promise<Permission> => {
  const response = await axios.get<Permission>(
    `/api/permissions/${permissionId}`
  );
  return response.data;
};

const create = async (Permission: Partial<Permission>): Promise<Permission> => {
  const response = await axios.post<Permission>("/api/permissions", Permission);
  return response.data;
};

const seed = async (): Promise<Permission> => {
  const response = await axios.get("/api/permissions/seed");
  return response.data;
};

const update = async (
  permissionId: number,
  Permission: Partial<Permission>
): Promise<Permission> => {
  const response = await axios.put<Permission>(
    `/api/permissions/${permissionId}`,
    Permission
  );
  return response.data;
};

const remove = async (permissionId: number): Promise<void> => {
  await axios.delete(`/api/permissions/${permissionId}`);
};

export const permission = {
  // Permissions
  findPaginated,
  findAll,
  findById,
  create,
  seed,
  update,
  remove,
};
