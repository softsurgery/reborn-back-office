import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Bug, ServerResponse } from "@/types";

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  sort: string,
  filter: string = "",
  fields: string[] = [],
  join: string[] = []
): Promise<Paginated<Bug>> => {
  const response = await axios.get<Paginated<Bug>>(`/api/admin/bugs/list?`, {
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

const findAll = async (): Promise<Bug[]> => {
  const response = await axios.get<Bug[]>(`/api/admin/bugs`);
  return response.data;
};

const findById = async (bugId: number): Promise<Bug> => {
  const response = await axios.get<Bug>(`/api/admin/bugs/${bugId}`);
  return response.data;
};

const create = async (Bug: Partial<Bug>): Promise<Bug> => {
  const response = await axios.post<Bug>("/api/admin/bugs", Bug);
  return response.data;
};

const update = async (bugId: number, Bug: Partial<Bug>): Promise<Bug> => {
  const response = await axios.put<Bug>(`/api/admin/bugs/${bugId}`, Bug);
  return response.data;
};

const remove = async (bugId: number): Promise<Bug> => {
  const response = await axios.delete(`/api/admin/bugs/${bugId}`);
  return response.data;
};

export const bug = {
  // Bugs
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
