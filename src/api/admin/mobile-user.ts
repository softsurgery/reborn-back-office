import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { MobileUser, ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "region,user",
}: IQueryObject): Promise<Paginated<MobileUser>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<MobileUser>>(
    `/api/admin/mobile-users/list?`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<MobileUser[]> => {
  const response = await axios.get<MobileUser[]>(`/api/admin/mobile-users`);
  return response.data;
};

const findById = async (mobileUserId: string): Promise<MobileUser> => {
  const response = await axios.get<MobileUser>(`/api/mobile-users/${mobileUserId}`);
  return response.data;
};

const create = async (MobileUser: Partial<MobileUser>): Promise<MobileUser> => {
  const response = await axios.post<MobileUser>("/api/admin/mobile-users", MobileUser);
  return response.data;
};

const update = async (
  mobileUserId: string,
  MobileUser: Partial<MobileUser>
): Promise<MobileUser> => {
  const response = await axios.put<MobileUser>(
    `/api/mobile-users/${mobileUserId}`,
    MobileUser
  );
  return response.data;
};

const remove = async (mobileUserId: string): Promise<void> => {
  await axios.delete(`/api/admin/mobile-users/${mobileUserId}`);
};

export const mobileUser = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
