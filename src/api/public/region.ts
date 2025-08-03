import axios from "../axios";
import { CreateRegionDto, Paginated, QueryParams, ResponseRegionDto, ServerResponse, UpdateRegionDto } from "@/types";

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
  const response = await axios.get<ResponseRegionDto[]>(`/public/region`);
  return response.data;
};

const findById = async (regionId: number): Promise<ResponseRegionDto> => {
  const response = await axios.get<ResponseRegionDto>(
    `/public/region/${regionId}`
  );
  return response.data;
};

const create = async (
  Region: CreateRegionDto
): Promise<CreateRegionDto> => {
  const response = await axios.post("/public/region", Region);
  return response.data;
};

const update = async (
  regionId?: number,
  Region?: UpdateRegionDto
): Promise<UpdateRegionDto> => {
  const response = await axios.put(
    `/public/region/${regionId}`,
    Region
  );
  return response.data;
};

const remove = async (regionId?: number): Promise<ResponseRegionDto> => {
  const response = await axios.delete(`/public/region/${regionId}`);
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
