import { Store, Paginated, QueryParams, UpdateStoreDto } from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "permissions.permission",
}: QueryParams): Promise<Paginated<Store>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Store>>(`/admin/store/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<Store[]> => {
  const response = await axios.get<Store[]>(`/admin/store/all`);
  return response.data;
};

const findById = async (id: string): Promise<Store> => {
  const response = await axios.get<Store>(`/admin/store/${id}`);
  return response.data;
};

const update = async (updateStoreDto: UpdateStoreDto): Promise<Store> => {
  const response = await axios.put<Store>(`/admin/store`, updateStoreDto);
  return response.data;
};

const updateMany = async (stores: UpdateStoreDto[]): Promise<Store[]> => {
  const response = await axios.put<Store[]>(`/admin/store/bulk`, stores);
  return response.data;
};

export const store = {
  findPaginated,
  findAll,
  findById,
  update,
  updateMany,
};
