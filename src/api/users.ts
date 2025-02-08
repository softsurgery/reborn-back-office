import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { User } from "@/types/user-management";
import { USER_FILTER_ATTRIBUTES } from "@/constants/user.filter-fields";

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  sort: string,
  filter: string = "",
  fields: string[] = [],
  join: string[] = ["role"]
): Promise<Paginated<User>> => {
  const response = await axios.get<Paginated<User>>(`/api/users?`, {
    params: {
      page,
      size,
      sort,
      filter,
      fields: fields ? fields.join(",") : "",
      join: join ? join.join(",") : "",
    },
  });
  return response.data;
};

const activate = async (id?: string): Promise<User> => {
  const response = await axios.get<User>(`/api/users/activate/${id}`);
  return response.data;
};

const deactivate = async (id?: string): Promise<User> => {
  const response = await axios.get<User>(`/api/users/deactivate/${id}`);
  return response.data;
};

const findAll = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`/api/users`);
  return response.data;
};

const findById = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`/api/users/${userId}`);
  return response.data;
};

const create = async (user: Partial<User>): Promise<User> => {
  const response = await axios.post<User>("/api/users", user);
  return response.data;
};

const update = async (userId?: string, user?: Partial<User>): Promise<User> => {
  const response = await axios.put<User>(`/api/users/${userId}`, user);
  return response.data;
};

const remove = async (userId?: string): Promise<void> => {
  await axios.delete(`/api/users/${userId}`);
};

export const user = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  activate,
  deactivate,
  remove,
};
