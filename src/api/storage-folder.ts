import { StorageFolder, StorageFolderContents } from "@/types/storage-folder";
import axios from "./axios";

const getTree = async (): Promise<StorageFolder[]> => {
  const response = await axios.get<StorageFolder[]>("/storage-folder/tree");
  return response.data;
};

const getRootContents = async (): Promise<StorageFolderContents> => {
  const response = await axios.get<StorageFolderContents>(
    "/storage-folder/contents",
  );
  return response.data;
};

const getFolderContents = async (
  folderId: number,
): Promise<StorageFolderContents> => {
  const response = await axios.get<StorageFolderContents>(
    `/storage-folder/${folderId}/contents`,
  );
  return response.data;
};

const getBreadcrumb = async (folderId: number): Promise<StorageFolder[]> => {
  const response = await axios.get<StorageFolder[]>(
    `/storage-folder/${folderId}/breadcrumb`,
  );
  return response.data;
};

const createFolder = async (data: {
  name: string;
  parentId?: number;
}): Promise<StorageFolder> => {
  const response = await axios.post<StorageFolder>("/storage-folder", data);
  return response.data;
};

export const storageFolder = {
  getTree,
  getRootContents,
  getFolderContents,
  getBreadcrumb,
  createFolder,
};
