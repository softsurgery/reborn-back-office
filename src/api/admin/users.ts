import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { ServerResponse } from "@/types";
import { User } from "@/prisma/interfaces";
import { Server } from "http";

//base ***************************************************************************************
const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "role",
}: IQueryObject): Promise<Paginated<User>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<User>>(`/api/admin/users/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`/api/admin/users`);
  return response.data;
};

const findById = async (userId?: string, join?: string): Promise<User> => {
  const response = await axios.get<User>(`/api/admin/users/${userId}`, {
    params: {
      join,
    },
  });
  return response.data;
};

const create = async (user: Partial<User>): Promise<ServerResponse<User>> => {
  const response = await axios.post("/api/admin/users", user);
  return response.data;
};

const update = async (
  userId?: string,
  user?: Partial<User>
): Promise<ServerResponse<User>> => {
  const response = await axios.put(`/api/admin/users/${userId}`, user);
  return response.data;
};

const remove = async (userId?: string): Promise<ServerResponse<User>> => {
  const response = await axios.delete(`/api/admin/users/${userId}`);
  return response.data;
};

//utilities ***************************************************************************************

const activate = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/admin/users/activate/${id}`);
  return response.data;
};

const deactivate = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/admin/users/deactivate/${id}`);
  return response.data;
};

const approve = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/admin/users/approve/${id}`);
  return response.data;
};

const disapprove = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/admin/users/disapprove/${id}`);
  return response.data;
};

const findByEmail = async (email?: string, join?: string): Promise<User> => {
  const response = await axios.get<User[]>(`/api/admin/users`, {
    params: {
      filter: `email||$eq||${email}`,
      join,
    },
  });
  return response.data[0];
};

const hasPermissions = async (
  id?: string,
  permissions?: string[]
): Promise<ServerResponse<boolean>> => {
  const response = await axios.post(`/api/admin/users/has-permissions`, {
    id,
    permissions,
  });
  return response.data;
};

export const user = {
  // base
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
  //utilties
  activate,
  deactivate,
  approve,
  disapprove,
  findByEmail,
  hasPermissions,
};
