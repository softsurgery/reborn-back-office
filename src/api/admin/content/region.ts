import axios from "axios";
import { Paginated, QueryParams, Region, ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "10",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<Region>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
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

const create = async (
  Region: Partial<Region>
): Promise<ServerResponse<Region>> => {
  const response = await axios.post("/api/admin/content/regions", Region);
  return response.data;
};

const update = async (
  regionId?: number,
  Region?: Partial<Region>
): Promise<ServerResponse<Region>> => {
  const response = await axios.put(
    `/api/admin/content/regions/${regionId}`,
    Region
  );
  return response.data;
};

const remove = async (regionId?: number): Promise<ServerResponse<Region>> => {
  const response = await axios.delete(`/api/admin/content/regions/${regionId}`);
  return response.data;
};

export const region = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
