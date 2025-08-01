import axios from "../axios";
import { Paginated, QueryParams, ResponseDeviceInfoDto } from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  filter = "",
  search = "",
}: QueryParams): Promise<Paginated<ResponseDeviceInfoDto>> => {
  const response = await axios.get<Paginated<ResponseDeviceInfoDto>>(
    `/admin/device-info/list`,
    {
      params: {
        page,
        limit,
        sort,
        filter,
        search,
      },
    }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseDeviceInfoDto[]> => {
  const response = await axios.get<ResponseDeviceInfoDto[]>(
    `/admin/device-info`
  );
  return response.data;
};

const findById = async (
  deviceInfoId: number
): Promise<ResponseDeviceInfoDto> => {
  const response = await axios.get<ResponseDeviceInfoDto>(
    `/admin/device-info/${deviceInfoId}`
  );
  return response.data;
};

const create = async (
  DeviceInfo: Partial<ResponseDeviceInfoDto>
): Promise<ResponseDeviceInfoDto> => {
  const response = await axios.post<ResponseDeviceInfoDto>(
    "/admin/device-info",
    DeviceInfo
  );
  return response.data;
};

const remove = async (deviceInfoId: number): Promise<ResponseDeviceInfoDto> => {
  const response = await axios.delete(`/admin/device-info/${deviceInfoId}`);
  return response.data;
};

export const deviceInfo = {
  // DeviceInfos
  findPaginated,
  findAll,
  findById,
  create,
  remove,
};
