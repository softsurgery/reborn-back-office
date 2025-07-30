import axios from "../axios";
import {
  CreateFeedbackDto,
  Paginated,
  QueryParams,
  ResponseFeedbackDto,
  UpdateFeedbackDto,
} from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "permissions.permission",
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
    `/admin/feedback/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseFeedbackDto[]> => {
  const response = await axios.get<ResponseFeedbackDto[]>(
    `/admin/feedback/all`
  );
  return response.data;
};

const findById = async (feedbackId: number): Promise<ResponseFeedbackDto> => {
  const response = await axios.get<ResponseFeedbackDto>(
    `/admin/feedback/${feedbackId}`
  );
  return response.data;
};

const create = async (
  Feedback: CreateFeedbackDto
): Promise<ResponseFeedbackDto> => {
  const response = await axios.post<ResponseFeedbackDto>(
    "/admin/feedback",
    Feedback
  );
  return response.data;
};

const update = async (
  feedbackId?: number,
  Feedback?: UpdateFeedbackDto
): Promise<ResponseFeedbackDto> => {
  const response = await axios.put<ResponseFeedbackDto>(
    `/admin/feedback/${feedbackId}`,
    Feedback
  );
  return response.data;
};

const remove = async (feedbackId?: number): Promise<ResponseFeedbackDto> => {
  const response = await axios.delete(`/admin/feedback/${feedbackId}`);
  return response.data;
};

export const feedback = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
