import { Paginated, QueryParams } from "@/types";
import axios from "./axios";
import { ResponseNotificationDto } from "@/types/notifications";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "user",
}: QueryParams): Promise<Paginated<ResponseNotificationDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseNotificationDto>>(
    `/notification/list`,
    { params }
  );
  return response.data;
};

const findPaginatedByUser = async (
  userId: string,
  {
    page = "1",
    limit = "5",
    sort,
    search = "",
    filter = "",
    join = "",
  }: QueryParams
): Promise<Paginated<ResponseNotificationDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseNotificationDto>>(
    `/notification/list/${userId}`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseNotificationDto[]> => {
  const response = await axios.get<ResponseNotificationDto[]>(
    `/notification/all`
  );
  return response.data;
};

const findById = async (
  id: string | number
): Promise<ResponseNotificationDto> => {
  const response = await axios.get<ResponseNotificationDto>(
    `/notification/${id}`
  );
  return response.data;
};

export const notification = {
  findPaginated,
  findPaginatedByUser,
  findAll,
  findById,
};
