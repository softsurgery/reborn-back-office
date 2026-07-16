import { Paginated, QueryParams, ServerResponse, Upload } from "@/types";
import axios, { BASE_URL } from "./axios";

const getStorageUrl = (path: string) => {
  const baseUrl = (axios.defaults.baseURL || BASE_URL || "").replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${baseUrl}/${cleanPath}`;
};

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<Upload>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Upload>>(`/storage/list`, {
    params,
  });

  return response.data;
};

export const uploadFiles = async (
  files: File[],
  onProgress?: (percent: number) => void,
  temporary: boolean = true,
): Promise<Upload[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post<Upload[]>(
    temporary ? "/storage/multiple/temporary" : "/storage/multiple",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    },
  );
  return response.data;
};

const downloadFile = async (slug: string, filename?: string) => {
  try {
    const response = await axios.get(`/storage/download/slug/${slug}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || slug;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

const openFile = async (slug: string) => {
  try {
    const url = getStorageUrl(`/storage/view/slug/${slug}`);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Open failed:", error);
  }
};

export const getUploadBySlug = (slug: string): string => {
  return getStorageUrl(`/storage/view/slug/${slug}`);
};

export const getUploadById = (id: number): string => {
  return getStorageUrl(`/storage/view/id/${id}`);
};

const deleteFile = async (slug: string): Promise<ServerResponse<Upload>> => {
  const response = await axios.delete(`/storage/${slug}`);
  return response.data;
};

export const upload = {
  findPaginated,
  uploadFiles,
  downloadFile,
  deleteFile,
  openFile,
  getUploadBySlug,
  getUploadById,
};
