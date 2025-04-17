import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Region, ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Region>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Region>>(
    `/api/admin/content/regions/list?`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<Region[]> => {
  const response = await axios.get<Region[]>(`/api/admin/content/regions`);
  return response.data;
};

const findById = async (regionId: number): Promise<Region> => {
  const response = await axios.get<Region>(
    `/api/admin/content/regions/${regionId}`
  );
  return response.data;
};

const create = async (Region: Partial<Region>): Promise<Region> => {
  const response = await axios.post<Region>("/api/admin/regions", Region);
  return response.data;
};

const update = async (
  regionId: number,
  Region: Partial<Region>
): Promise<Region> => {
  const response = await axios.put<Region>(
    `/api/admin/content/regions/${regionId}`,
    Region
  );
  return response.data;
};

const remove = async (regionId: number): Promise<void> => {
  await axios.delete(`/api/admin/content/regions/${regionId}`);
};

// const seed = async (): Promise<ServerResponse> => {
//   const response = await axios.get("/api/admin/content/regions/seed");
//   return response.data;
// };

export const region = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
//   seed,
};
