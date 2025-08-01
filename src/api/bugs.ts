import { Paginated, QueryParams, ResponseBugDto } from "@/types";
import axios from "./axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseBugDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseBugDto>>(`/bug/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<ResponseBugDto[]> => {
  const response = await axios.get<ResponseBugDto[]>(`/bug/all`);
  return response.data;
};

const findById = async (id: number): Promise<ResponseBugDto> => {
  const response = await axios.get<ResponseBugDto>(`/bug/${id}`);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseBugDto> => {
  const response = await axios.delete(`/bug/${id}`);
  return response.data;
};

export const bug = {
  findPaginated,
  findAll,
  findById,
  remove,
};
