import axios from "../axios";
import { Paginated, QueryParams, ResponseCurrencyDto } from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "10",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseCurrencyDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseCurrencyDto>>(
    `/public/currency/list`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseCurrencyDto[]> => {
  const response = await axios.get<ResponseCurrencyDto[]>(
    `/public/currency/all`
  );
  return response.data;
};

const findById = async (id: number): Promise<ResponseCurrencyDto> => {
  const response = await axios.get<ResponseCurrencyDto>(
    `/public/currency/${id}`
  );
  return response.data;
};

export const currency = {
  findPaginated,
  findAll,
  findById,
};
