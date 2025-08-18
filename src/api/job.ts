import axios from "./axios";
import {
  CreateJobDto,
  Paginated,
  QueryParams,
  ResponseJobDto,
  UpdateJobDto,
} from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobDto>>(`/job/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<ResponseJobDto[]> => {
  const response = await axios.get<ResponseJobDto[]>(`/job/all`);
  return response.data;
};

const findById = async (jobId: string): Promise<ResponseJobDto> => {
  const response = await axios.get<ResponseJobDto>(`/job/${jobId}`);
  return response.data;
};

const create = async (createJobDto: CreateJobDto): Promise<CreateJobDto> => {
  const response = await axios.post("/job", createJobDto);
  return response.data;
};

const update = async (
  id?: string,
  updateJobDto?: UpdateJobDto
): Promise<UpdateJobDto> => {
  const response = await axios.put(`/job/${id}`, updateJobDto);
  return response.data;
};

const remove = async (jobId?: string): Promise<ResponseJobDto> => {
  const response = await axios.delete(`/job/${jobId}`);
  return response.data;
};

export const job = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
