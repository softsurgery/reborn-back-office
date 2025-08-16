import { Paginated, QueryParams, ServerResponse, Upload } from "@/types";
import axios from "./axios";

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

  const response = await axios.get<Paginated<Upload>>(`/upload/list`, {
    params,
  });

  return response.data;
};

export const uploadFiles = async (
  files: File[],
  onProgress?: (percent: number) => void,
  temporary: boolean = true
): Promise<Upload[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post<Upload[]>(
    temporary ? "/upload/multiple/temporary" : "/upload/multiple",
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
    }
  );
  return response.data;
};

const downloadFile = async (slug: string, filename?: string) => {
  try {
    const response = await axios.get(`/upload/download/slug/${slug}`, {
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
    const response = await axios.get(`/upload/download/slug/${slug}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error("Open failed:", error);
  }
};

export const getUploadBySlug = async (slug: string) => {
  const url = `/upload/view/slug/${slug}`;
  const { data } = await axios.get(url, { responseType: "blob" });
  return URL.createObjectURL(data);
};

export const getUploadById = async (id: number) => {
  const url = `/upload/view/id/${id}`;
  const { data } = await axios.get(url, { responseType: "blob" });
  return URL.createObjectURL(data);
};

const deleteFile = async (slug: string): Promise<ServerResponse<Upload>> => {
  const response = await axios.delete(`/upload/${slug}`);
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
