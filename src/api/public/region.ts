import axios from "../axios";
import {
  CreateRegionDto,
  Paginated,
  QueryParams,
  ResponseRegionDto,
  UpdateRegionDto,
} from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "10",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseRegionDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseRegionDto>>(
    `/public/region/list`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseRegionDto[]> => {
  const response = await axios.get<ResponseRegionDto[]>(`/public/region/all`);
  return response.data;
};

const findById = async (id: number): Promise<ResponseRegionDto> => {
  const response = await axios.get<ResponseRegionDto>(`/public/region/${id}`);
  return response.data;
};

const create = async (
  createRegionDto: CreateRegionDto
): Promise<CreateRegionDto> => {
  const response = await axios.post("/public/region", createRegionDto);
  return response.data;
};

const update = async (
  id?: number,
  updateRegionDto?: UpdateRegionDto
): Promise<UpdateRegionDto> => {
  const response = await axios.put(`/public/region/${id}`, updateRegionDto);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseRegionDto> => {
  const response = await axios.delete(`/public/region/${id}`);
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
