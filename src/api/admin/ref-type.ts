import {
  CreateRefTypeDto,
  Paginated,
  QueryParams,
  ResponseRefTypeDto,
  UpdateRefTypeDto,
} from "@/types";
import axios from "../axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseRefTypeDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseRefTypeDto>>(
    `/ref-type/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseRefTypeDto[]> => {
  const response = await axios.get<ResponseRefTypeDto[]>(`/ref-type/all`);
  return response.data;
};

const findById = async (id: number): Promise<ResponseRefTypeDto> => {
  const response = await axios.get<ResponseRefTypeDto>(`/ref-type/${id}`);
  return response.data;
};

const create = async (role: CreateRefTypeDto): Promise<ResponseRefTypeDto> => {
  const response = await axios.post("/ref-type", role);
  return response.data;
};

const update = async (
  id?: number,
  refType?: UpdateRefTypeDto
): Promise<ResponseRefTypeDto> => {
  const response = await axios.put(`/ref-type/${id}`, refType);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseRefTypeDto> => {
  const response = await axios.delete(`/ref-type/${id}`);
  return response.data;
};

export const refType = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
