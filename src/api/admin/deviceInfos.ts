import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { DeviceInfo } from "@/types";

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  sort: string,
  filter: string = "",
  fields: string[] = [],
  join: string[] = []
): Promise<Paginated<DeviceInfo>> => {
  const response = await axios.get<Paginated<DeviceInfo>>(`/api/admin/deviceInfos/list?`, {
    params: {
      page,
      size,
      sort,
      filter,
      fields: fields ? fields.join(",") : "",
      join: join ? join.join(",") : "",
    },
  });
  return response.data;
};

const findAll = async (): Promise<DeviceInfo[]> => {
  const response = await axios.get<DeviceInfo[]>(`/api/admin/deviceInfos`);
  return response.data;
};

const findById = async (deviceInfoId: number): Promise<DeviceInfo> => {
  const response = await axios.get<DeviceInfo>(`/api/admin/deviceInfos/${deviceInfoId}`);
  return response.data;
};

const create = async (DeviceInfo: Partial<DeviceInfo>): Promise<DeviceInfo> => {
  const response = await axios.post<DeviceInfo>("/api/admin/deviceInfos", DeviceInfo);
  return response.data;
};

const update = async (deviceInfoId: number, DeviceInfo: Partial<DeviceInfo>): Promise<DeviceInfo> => {
  const response = await axios.put<DeviceInfo>(`/api/admin/deviceInfos/${deviceInfoId}`, DeviceInfo);
  return response.data;
};

const remove = async (deviceInfoId: number): Promise<DeviceInfo> => {
  const response = await axios.delete(`/api/admin/deviceInfos/${deviceInfoId}`);
  return response.data;
};

export const deviceInfo = {
  // DeviceInfos
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
};
