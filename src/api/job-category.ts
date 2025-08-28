import axios from "./axios";
import {
  CreateJobCategoryDto,
  Paginated,
  QueryParams,
  ResponseJobCategoryDto,
  UpdateJobCategoryDto,
} from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobCategoryDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobCategoryDto>>(
    `/job-category/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobCategoryDto[]> => {
  const response = await axios.get<ResponseJobCategoryDto[]>(
    `/job-category/all`
  );
  return response.data;
};

const findById = async (
  jobCategoryId: number
): Promise<ResponseJobCategoryDto> => {
  const response = await axios.get<ResponseJobCategoryDto>(
    `/job-category/${jobCategoryId}`
  );
  return response.data;
};

const create = async (
  createJobCategoryDto: CreateJobCategoryDto
): Promise<CreateJobCategoryDto> => {
  const response = await axios.post("/job-category", createJobCategoryDto);
  return response.data;
};

const update = async (
  id?: number,
  updateJobCategoryDto?: UpdateJobCategoryDto
): Promise<UpdateJobCategoryDto> => {
  const response = await axios.put(`/job-category/${id}`, updateJobCategoryDto);
  return response.data;
};

const remove = async (
  jobCategoryId?: number
): Promise<ResponseJobCategoryDto> => {
  const response = await axios.delete(`/job-category/${jobCategoryId}`);
  return response.data;
};

export const jobCategory = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
