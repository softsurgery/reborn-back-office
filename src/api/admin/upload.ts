import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Upload } from "@/prisma/interfaces";
import { ServerResponse } from "@/types";
import axios from "axios";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "user",
}: IQueryObject): Promise<Paginated<Upload>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Upload>>(
    `/api/admin/storage/list`,
    {
      params,
    }
  );

  return response.data;
};

const uploadFiles = async (
  files: { file: File; isPublic: boolean }[],
  userId: string
): Promise<ServerResponse<Upload[]>> => {
  const formData = new FormData();

  files.forEach(({ file, isPublic }, index) => {
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append(`isPublic_${index}`, String(isPublic));
  });

  const response = await axios.post("/api/admin/storage/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const downloadFile = async (slug: string, filename?: string) => {
  const res = await fetch(`/api/admin/storage/download/${slug}`);
  if (!res.ok) throw new Error("Failed to download file");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || slug;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const deleteFile = async (slug: string): Promise<ServerResponse<Upload>> => {
  const response = await axios.delete(`/api/admin/storage/${slug}`);
  return response.data;
};

export const upload = {
  findPaginated,
  uploadFiles,
  downloadFile,
  deleteFile,
};
