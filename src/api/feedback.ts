import axios from "./axios";
import { Paginated, QueryParams, ResponseFeedbackDto } from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseFeedbackDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseFeedbackDto>>(
    `/feedback/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseFeedbackDto[]> => {
  const response = await axios.get<ResponseFeedbackDto[]>(`/feedback/all`);
  return response.data;
};

const findById = async (feedbackId: number): Promise<ResponseFeedbackDto> => {
  const response = await axios.get<ResponseFeedbackDto>(
    `/feedback/${feedbackId}`
  );
  return response.data;
};

const remove = async (feedbackId?: number): Promise<ResponseFeedbackDto> => {
  const response = await axios.delete(`/feedback/${feedbackId}`);
  return response.data;
};

export const feedback = {
  findPaginated,
  findAll,
  findById,
  remove,
};
