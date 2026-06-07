import {
  ResponseConfigurationNamespaceDto,
  UpdateConfigurationParameterDto,
} from "@/types";
import axios from "../axios";

const findOneById = async (
  id: string,
): Promise<ResponseConfigurationNamespaceDto> => {
  const response = await axios.get(`/configuration/namespace/${id}`);
  return response.data;
};

const findAll = async (): Promise<ResponseConfigurationNamespaceDto[]> => {
  const response = await axios.get(`/configuration/all`);
  return response.data;
};

const findAllGlobal = async (): Promise<
  ResponseConfigurationNamespaceDto[]
> => {
  const response = await axios.get(`/configuration/all/global`);
  return response.data;
};

const update = async (data: UpdateConfigurationParameterDto[]) => {
  const response = await axios.put(`/configuration`, data);
  return response.data;
};

export const configuration = {
  findOneById,
  findAll,
  findAllGlobal,
  update,
};
