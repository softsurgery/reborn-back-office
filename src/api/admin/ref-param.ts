import {
  CreateRefParamDto,
  Paginated,
  QueryParams,
  ResponseRefParamDto,
  UpdateRefParamDto,
} from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseRefParamDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseRefParamDto>>(
    `/ref-param/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async ({
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<ResponseRefParamDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseRefParamDto[]>(`/ref-param/all`, {
    params,
  });
  return response.data;
};

const findById = async (id: number): Promise<ResponseRefParamDto> => {
  const response = await axios.get<ResponseRefParamDto>(`/ref-param/${id}`);
  return response.data;
};

const create = async (
  role: CreateRefParamDto
): Promise<ResponseRefParamDto> => {
  const response = await axios.post("/ref-param", role);
  return response.data;
};

const update = async (
  id?: number,
  refParam?: UpdateRefParamDto
): Promise<ResponseRefParamDto> => {
  const response = await axios.put(`/ref-param/${id}`, refParam);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseRefParamDto> => {
  const response = await axios.delete(`/ref-param/${id}`);
  return response.data;
};

export const refParam = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
